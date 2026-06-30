#!/usr/bin/env node
// ============================================================
// generate-vba.js
// One-time script: generates vbaProject.bin for multi-select
// Excel dropdowns. Run once; embed the output as base64 in
// template.ts.
//
// Usage: node generate-vba.js
// Output: vbaProject.bin + vba-base64.txt in current directory
// ============================================================

const CFB = require('cfb');
const fs  = require('fs');
const path = require('path');

// ─── MS-OVBA Compression (literal-only mode) ─────────────────
// We don't compress — all bytes are literal tokens in compressed
// chunks. This is valid per MS-OVBA spec (compressed-chunk format
// with flag byte 0x00 = all 8 tokens are literals).
// Excel accepts this and re-compiles the VBA source on first open.

function ovbaWrap(input) {
  if (typeof input === 'string') input = Buffer.from(input, 'latin1');
  const out = [0x01]; // SignatureByte (required)

  let i = 0;
  while (i < input.length) {
    const end  = Math.min(i + 4096, input.length);
    const chunk = input.slice(i, end);

    // Build "compressed chunk" data using all-literal tokens
    const cdata = [];
    for (let j = 0; j < chunk.length; ) {
      cdata.push(0x00); // FlagByte: all 8 bits = 0 → all tokens are literals
      for (let bit = 0; bit < 8 && j < chunk.length; bit++, j++) {
        cdata.push(chunk[j]);
      }
    }
    // Minimum compressed chunk data = 3 bytes (spec requirement)
    while (cdata.length < 3) cdata.push(0x00);

    // CompressedChunkHeader: bit15=1 (compressed), bits0-11 = (size-3)
    const hdr = ((cdata.length - 3) & 0x0FFF) | 0x8000;
    out.push(hdr & 0xFF, (hdr >> 8) & 0xFF, ...cdata);

    i = end;
  }
  return Buffer.from(out);
}

// ─── Binary helpers ───────────────────────────────────────────

function u16(val) {
  const b = Buffer.alloc(2); b.writeUInt16LE(val >>> 0, 0); return b;
}
function u32(val) {
  const b = Buffer.alloc(4); b.writeUInt32LE(val >>> 0, 0); return b;
}
// Standard VBA record: Id(2) + Size(4) + Data
function rec(id, data) {
  if (!Buffer.isBuffer(data)) data = Buffer.from(data, 'latin1');
  return Buffer.concat([u16(id), u32(data.length), data]);
}
// UTF-16 LE encoding
function utf16(str) {
  const b = Buffer.alloc(str.length * 2);
  for (let i = 0; i < str.length; i++) b.writeUInt16LE(str.charCodeAt(i), i * 2);
  return b;
}

// ─── VBA Source Code ──────────────────────────────────────────
// Handles multi-select dropdowns:
//   • Tracks previously selected cell value on SelectionChange
//   • On SheetChange, looks up "_MSConfig" sheet to see if the
//     column is multi-select; if so, APPENDS the newly-chosen
//     dropdown value with "|" instead of replacing.
//   • Selecting an already-chosen value removes it (toggle).

const VBA_CODE = `Attribute VB_Name = "ThisWorkbook"
Option Explicit

Private sPrev As String
Private sSheet As String
Private lRow As Long
Private lCol As Long

Private Sub Workbook_SheetSelectionChange(ByVal Sh As Object, ByVal Target As Range)
    If Target.Cells.Count > 1 Then Exit Sub
    sPrev = CStr(Target.Value)
    sSheet = Sh.Name
    lRow = Target.Row
    lCol = Target.Column
End Sub

Private Sub Workbook_SheetChange(ByVal Sh As Object, ByVal Target As Range)
    Dim wsCfg As Worksheet
    Dim isMS As Boolean
    Dim r As Long
    Dim key As String
    Dim newVal As String
    Dim res As String
    Dim parts() As String
    Dim j As Integer

    If Target.Cells.Count > 1 Then Exit Sub
    If Target.Row <= 1 Then Exit Sub
    If Sh.Name = "_MSConfig" Then Exit Sub
    If Sh.Name <> sSheet Or Target.Row <> lRow Or Target.Column <> lCol Then Exit Sub

    isMS = False
    On Error Resume Next
    Set wsCfg = ThisWorkbook.Worksheets("_MSConfig")
    On Error GoTo 0
    If wsCfg Is Nothing Then Exit Sub

    key = Sh.Name & ":" & CStr(Sh.Cells(1, Target.Column).Value)
    Dim lastR As Long
    lastR = wsCfg.Cells(wsCfg.Rows.Count, 1).End(xlUp).Row
    For r = 1 To lastR
        If CStr(wsCfg.Cells(r, 1).Value) = key Then isMS = True: Exit For
    Next r
    If Not isMS Then Exit Sub

    newVal = CStr(Target.Value)
    If newVal = "" Then sPrev = "": Exit Sub

    Application.EnableEvents = False

    If sPrev = "" Then
        res = newVal
    ElseIf InStr(1, "|" & sPrev & "|", "|" & newVal & "|", vbTextCompare) > 0 Then
        parts = Split(sPrev, "|")
        res = ""
        For j = 0 To UBound(parts)
            If LCase(Trim(parts(j))) <> LCase(Trim(newVal)) Then
                If res = "" Then res = Trim(parts(j)) Else res = res & "|" & Trim(parts(j))
            End If
        Next j
    Else
        res = sPrev & "|" & newVal
    End If

    Target.Value = res
    Application.EnableEvents = True
    sPrev = CStr(Target.Value)
End Sub
`;

// ─── _VBA_PROJECT stream ──────────────────────────────────────
// The first two bytes (0x61 0xCC) signal to Excel that the
// performance cache is absent — it will re-compile from source.

function makeVbaProject() {
  return Buffer.from([0x61, 0xCC, 0xFF, 0xFF, 0x00, 0x00, 0x00]);
}

// ─── dir stream ───────────────────────────────────────────────
// Per MS-OVBA §2.3.4.2. Record IDs are specified in the MS-OVBA
// Open Specification. MODULENAMEUNICODE and MODULEOFFSET both use
// Id=0x0031; they are distinguished by their ORDER in the stream.

function makeDirStream() {
  const modName   = 'ThisWorkbook';
  const streamName = 'ThisWorkbook';
  const moduleType = 0x0022; // 0x0022 = class module (ThisWorkbook)
  const textOffset = 0;      // compressed source starts at byte 0 in module stream

  const parts = [];

  // ── Project-level records ────────────────────────────────────
  parts.push(rec(0x0001, u32(0x00000001)));                     // PROJECTSYSKIND   (Win32)
  parts.push(rec(0x0002, u32(0x00000409)));                     // PROJECTLCID      (en-US)
  parts.push(rec(0x0014, u32(0x00000409)));                     // PROJECTLCIDINVOKE
  parts.push(rec(0x0003, u16(0x04E4)));                         // PROJECTCODEPAGE  (Windows-1252)
  parts.push(rec(0x0004, Buffer.from('VBAProject', 'ascii')));  // PROJECTNAME
  parts.push(rec(0x0005, Buffer.alloc(0)));                     // PROJECTDOCSTRING (MBCS, empty)
  parts.push(rec(0x0040, Buffer.alloc(0)));                     // PROJECTDOCSTRING (unicode, empty)
  parts.push(rec(0x0006, Buffer.alloc(0)));                     // PROJECTHELPFILEPATH
  parts.push(rec(0x003D, Buffer.alloc(0)));                     // PROJECTHELPFILEPATH2
  parts.push(rec(0x0007, u32(0x00000000)));                     // PROJECTHELPCONTEXT
  parts.push(rec(0x0008, u32(0x00000000)));                     // PROJECTLIBFLAGS
  // PROJECTVERSION: special format — Size=4 for MajorVersion only; MinorVersion is extra 2 bytes
  parts.push(u16(0x0009), u32(4), u32(0x000061C8), u16(0x000D));
  parts.push(rec(0x000C, Buffer.alloc(0)));                     // PROJECTCONSTANTS (MBCS, empty)
  parts.push(rec(0x003C, Buffer.alloc(0)));                     // PROJECTCONSTANTS (unicode, empty)

  // ── Modules header ───────────────────────────────────────────
  parts.push(rec(0x000F, u32(1)));                              // Module count = 1
  parts.push(rec(0x0013, u16(0xFFFF)));                         // PROJECTCOOKIE

  // ── Module: ThisWorkbook ─────────────────────────────────────
  parts.push(rec(0x0019, Buffer.from(modName, 'ascii')));       // MODULENAME
  parts.push(rec(0x0031, utf16(modName)));                      // MODULENAMEUNICODE (first 0x0031)
  parts.push(rec(0x001A, Buffer.from(streamName, 'ascii')));    // MODULESTREAMNAME
  parts.push(rec(0x0032, utf16(streamName)));                   // MODULESTREAMNAME (unicode)
  parts.push(rec(0x001C, Buffer.alloc(0)));                     // MODULEDOCSTRING (empty)
  parts.push(rec(0x0048, Buffer.alloc(0)));                     // MODULEDOCSTRING (unicode, empty)
  parts.push(rec(0x0031, u32(textOffset)));                     // MODULEOFFSET (second 0x0031)
  parts.push(rec(0x001E, u32(0x00000000)));                     // MODULEHELPCONTEXT
  parts.push(rec(0x002C, u16(0xFFFF)));                         // MODULECOOKIE
  parts.push(rec(moduleType, Buffer.alloc(0)));                 // MODULETYPE (class)
  parts.push(rec(0x0028, Buffer.alloc(0)));                     // MODULEPRIVATE
  parts.push(rec(0x002B, Buffer.alloc(0)));                     // Module terminator

  // ── PROJECTMODULES terminator ────────────────────────────────
  parts.push(rec(0x0010, Buffer.alloc(0)));

  return Buffer.concat(parts);
}

// ─── PROJECT text stream ──────────────────────────────────────

function makeProjectStream() {
  return Buffer.from(
    'ID="{00000000-0000-0000-0000-000000000000}"\r\n' +
    'Document=ThisWorkbook/&H00000000\r\n' +
    'Name="VBAProject"\r\n' +
    'HelpContextID="0"\r\n' +
    'VersionCompatible32="393222000"\r\n' +
    'CMG=""\r\n' +
    'DPB=""\r\n' +
    'GC=""\r\n',
    'ascii'
  );
}

// ─── Assemble vbaProject.bin ──────────────────────────────────

function buildVbaProject() {
  const cfb = CFB.utils.cfb_new({ root: 'R' });

  // _VBA_PROJECT stream
  CFB.utils.cfb_add(cfb, 'R/VBA/_VBA_PROJECT', makeVbaProject());

  // dir stream (OVBA-wrapped)
  const dirRaw = makeDirStream();
  CFB.utils.cfb_add(cfb, 'R/VBA/dir', ovbaWrap(dirRaw));

  // Module source stream (OVBA-wrapped)
  const srcBuf = Buffer.from(VBA_CODE, 'latin1');
  CFB.utils.cfb_add(cfb, 'R/VBA/ThisWorkbook', ovbaWrap(srcBuf));

  // PROJECT text stream (plain text, not compressed)
  CFB.utils.cfb_add(cfb, 'R/PROJECT', makeProjectStream());

  // PROJECTwm (empty — code-name mapping, not needed for simple projects)
  CFB.utils.cfb_add(cfb, 'R/PROJECTwm', Buffer.alloc(0));

  return CFB.write(cfb, { type: 'buffer' });
}

// ─── Main ─────────────────────────────────────────────────────

const outDir  = path.dirname(__filename);
const binPath = path.join(outDir, 'vbaProject.bin');
const b64Path = path.join(outDir, 'vba-base64.txt');

const bin = buildVbaProject();
fs.writeFileSync(binPath, bin);
fs.writeFileSync(b64Path, bin.toString('base64'));

console.log(`✓ vbaProject.bin written (${bin.length} bytes) → ${binPath}`);
console.log(`✓ base64 written → ${b64Path}`);
console.log('\nEmbed in template.ts:');
console.log(`const VBA_BASE64 = '${bin.toString('base64').slice(0, 40)}...' (${bin.toString('base64').length} chars)`);
