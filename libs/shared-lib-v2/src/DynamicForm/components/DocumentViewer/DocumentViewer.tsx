import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from '@mui/material';
import {
  ErrorOutline,
  PictureAsPdf,
  Description,
  TableChart,
  Slideshow,
  Download,
  ZoomIn,
  ZoomOut,
} from '@mui/icons-material';
import axios from 'axios';

interface DocumentViewerProps {
  url: string;
  width?: string | number;
  height?: string | number;
  showError?: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  url,
  width = '100%',
  height = '600px',
  showError = true,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [useOfficeViewer, setUseOfficeViewer] = useState(false);

  // Determine file type from URL
  const fileType = useMemo(() => {
    if (!url) return null;
    const urlLower = url.toLowerCase();
    const extension = urlLower.substring(urlLower.lastIndexOf('.'));

    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
      return 'image';
    } else if (extension === '.pdf') {
      return 'pdf';
    } else if (['.doc', '.docx'].includes(extension)) {
      return 'word';
    } else if (['.xls', '.xlsx'].includes(extension)) {
      return 'excel';
    } else if (['.ppt', '.pptx'].includes(extension)) {
      return 'powerpoint';
    }
    return 'unknown';
  }, [url]);

  // Generate Microsoft Office Online Viewer URL
  const getOfficeViewerUrl = (fileUrl: string, fileType: string) => {
    const encodedUrl = encodeURIComponent(fileUrl);
    if (fileType === 'word' || fileType === 'word-old') {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
    } else if (fileType === 'excel') {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
    } else if (fileType === 'powerpoint') {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
    }
    return fileUrl;
  };

  // Fetch file content
  useEffect(() => {
    if (!url || fileType === 'image' || fileType === 'pdf') {
      // Images and PDFs can be loaded directly
      setLoading(false);
      return;
    }

    // Use Microsoft Office Viewer for Word documents (both .doc and .docx) by default
    if (fileType === 'word') {
      setUseOfficeViewer(true);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchFile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          validateStatus: (status) => status < 500, // Don't throw on 4xx errors
        });

        // Check if response is actually a file or an error page
        const contentType = response.headers['content-type'] || '';
        const data = response.data;

        // Check if response is HTML (likely an error page)
        if (
          contentType.includes('text/html') ||
          contentType.includes('application/json')
        ) {
          // Try to parse as text to see error message
          const textDecoder = new TextDecoder();
          const text = textDecoder.decode(new Uint8Array(data.slice(0, 500))); // First 500 bytes
          console.error('Server returned non-file content:', {
            contentType,
            preview: text.substring(0, 200),
          });
          throw new Error(
            `Server returned ${contentType} instead of file content. This might be an error page or the URL requires authentication.`
          );
        }

        // Validate arrayBuffer is not empty
        if (!data || data.byteLength === 0) {
          throw new Error('File appears to be empty or corrupted.');
        }

        // Check minimum file size (DOCX files should be at least a few KB)
        if (data.byteLength < 100) {
          throw new Error('File is too small to be a valid document.');
        }

        // Log file info for debugging
        console.log('File fetched successfully:', {
          size: data.byteLength,
          contentType,
          url: url.substring(0, 100), // First 100 chars of URL
        });

        setFileContent(data);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        if (err.response?.status === 403) {
          setError('File is not accessible. Please check permissions.');
        } else if (err.response?.status === 404) {
          setError('File not found. Please check the URL.');
        } else if (err.message) {
          setError(err.message);
        } else {
          setError(
            'Failed to load the document. Please check if the URL is accessible.'
          );
        }
      }
    };

    fetchFile();
  }, [url, fileType]);

  // Validate if arrayBuffer is a valid DOCX/ZIP file
  const isValidDocx = (arrayBuffer: ArrayBuffer): boolean => {
    try {
      const uint8Array = new Uint8Array(arrayBuffer);
      // DOCX files start with PK (ZIP signature: 50 4B 03 04 or 50 4B 05 06)
      // Check for ZIP file signature
      if (uint8Array.length < 4) {
        console.error('File too small to be valid DOCX');
        return false;
      }
      const signature = uint8Array[0] === 0x50 && uint8Array[1] === 0x4b;
      if (!signature) {
        console.error('File does not have ZIP signature. First bytes:', {
          byte0: uint8Array[0],
          byte1: uint8Array[1],
          firstBytes: Array.from(uint8Array.slice(0, 10)),
        });
      }
      return signature;
    } catch (err) {
      console.error('Error validating DOCX file:', err);
      return false;
    }
  };

  // Parse Word document (DOCX)
  const parseWordDocument = async (arrayBuffer: ArrayBuffer) => {
    try {
      // Validate file format before parsing
      if (!isValidDocx(arrayBuffer)) {
        throw new Error(
          'Invalid DOCX file format. The file may be corrupted, not a DOCX file, or is an old .doc format (which is not supported). Please ensure the file is a valid .docx file.'
        );
      }

      // Dynamic import to avoid bundling issues
      // @ts-ignore - mammoth doesn't have type definitions
      let mammothModule;
      try {
        mammothModule = await import('mammoth');
      } catch (importError: any) {
        console.error('Failed to import mammoth:', importError);
        throw new Error(
          `Cannot import mammoth library. Please ensure 'mammoth' is installed: npm install mammoth. Error: ${
            importError?.message || 'Unknown import error'
          }`
        );
      }

      // Handle both default and named exports
      const mammoth = mammothModule.default || mammothModule;

      if (!mammoth || typeof mammoth.convertToHtml !== 'function') {
        throw new Error(
          'mammoth.convertToHtml is not available. Please check mammoth installation.'
        );
      }

      const result = await mammoth.convertToHtml({ arrayBuffer });
      return result.value;
    } catch (err: any) {
      console.error('Error parsing Word document:', err);
      // Provide more detailed error message
      const errorMessage = err?.message || 'Unknown error';

      // Check for specific ZIP-related errors
      if (
        errorMessage.includes('zip') ||
        errorMessage.includes('central directory')
      ) {
        throw new Error(
          `Invalid or corrupted DOCX file. The file may not be a valid DOCX document, or it may be corrupted. Error: ${errorMessage}`
        );
      }

      throw new Error(`Failed to parse Word document: ${errorMessage}`);
    }
  };

  // Parse Excel document (XLSX)
  const parseExcelDocument = async (arrayBuffer: ArrayBuffer) => {
    try {
      // Dynamic import to avoid bundling issues
      // @ts-ignore - xlsx types may not be available
      let xlsxModule;
      try {
        xlsxModule = await import('xlsx');
      } catch (importError: any) {
        console.error('Failed to import xlsx:', importError);
        throw new Error(
          `Cannot import xlsx library. Please ensure 'xlsx' is installed: npm install xlsx. Error: ${
            importError?.message || 'Unknown import error'
          }`
        );
      }

      // Handle both default and named exports
      const XLSX = xlsxModule.default || xlsxModule;

      if (!XLSX || typeof XLSX.read !== 'function') {
        throw new Error(
          'XLSX.read is not available. Please check xlsx installation.'
        );
      }

      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
      });
      return jsonData;
    } catch (err: any) {
      console.error('Error parsing Excel document:', err);
      // Provide more detailed error message
      const errorMessage = err?.message || 'Unknown error';
      throw new Error(`Failed to parse Excel document: ${errorMessage}`);
    }
  };

  // Process file content based on type
  useEffect(() => {
    if (
      !fileContent ||
      fileType === 'image' ||
      fileType === 'pdf' ||
      useOfficeViewer
    ) {
      return;
    }

    const processFile = async () => {
      try {
        setLoading(true);
        let processedContent: any = null;

        if (fileType === 'word') {
          // Try custom parsing first, fallback to Office Viewer on error
          try {
            processedContent = await parseWordDocument(fileContent);
          } catch (parseError: any) {
            console.warn(
              'Custom Word parsing failed, using Microsoft Office Viewer:',
              parseError
            );
            setUseOfficeViewer(true);
            setLoading(false);
            return;
          }
        } else if (fileType === 'excel') {
          processedContent = await parseExcelDocument(fileContent);
        }

        setFileContent(processedContent);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Failed to process document');
      }
    };

    processFile();
  }, [fileContent, fileType]);

  const handleLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleError = () => {
    setLoading(false);
    setError(
      'Failed to load the document. Please check if the URL is accessible.'
    );
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  if (!url) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={width}
        height={height}
        border="1px dashed #ccc"
        borderRadius={1}
      >
        <Typography color="textSecondary">No document URL provided</Typography>
      </Box>
    );
  }

  const renderViewer = () => {
    switch (fileType) {
      case 'image':
        return (
          <Box
            component="img"
            src={url}
            alt="Document"
            onLoad={handleLoad}
            onError={handleError}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: loading ? 'none' : 'block',
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s',
            }}
          />
        );

      case 'pdf':
        return (
          <iframe
            src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            onLoad={handleLoad}
            onError={handleError}
            title="PDF Document"
          />
        );

      case 'word':
        // Use Microsoft Office Viewer for Word documents
        if (useOfficeViewer) {
          const viewerUrl = getOfficeViewerUrl(url, 'word');
          return (
            <iframe
              src={viewerUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              onLoad={handleLoad}
              onError={handleError}
              title="Word Document"
            />
          );
        }
        // Custom parsed content (if available)
        if (typeof fileContent === 'string') {
          return (
            <Box
              sx={{
                p: 3,
                overflow: 'auto',
                height: '100%',
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                width: `${100 / zoom}%`,
                transition: 'transform 0.2s',
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: fileContent }} />
            </Box>
          );
        }
        return null;

      case 'excel':
        if (Array.isArray(fileContent) && fileContent.length > 0) {
          const headers = fileContent[0] as string[];
          const rows = fileContent.slice(1) as string[][];

          return (
            <Box
              sx={{
                overflow: 'auto',
                height: '100%',
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                width: `${100 / zoom}%`,
                transition: 'transform 0.2s',
              }}
            >
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            backgroundColor: 'background.paper',
                            fontWeight: 'bold',
                          }}
                        >
                          {header || `Column ${index + 1}`}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {headers.map((_, colIndex) => (
                          <TableCell key={colIndex}>
                            {row[colIndex] || ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );
        }
        return null;

      case 'powerpoint':
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            gap={2}
            p={3}
          >
            <Slideshow sx={{ fontSize: 64, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary">
              PowerPoint Preview
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              PowerPoint files cannot be previewed directly in the browser.
              Please download the file to view it.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Download />}
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PowerPoint
            </Button>
          </Box>
        );

      default:
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            gap={2}
          >
            <ErrorOutline sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography variant="body1" color="text.secondary">
              Unsupported file type
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported formats: JPG, PNG, JPEG, PDF, DOC, DOCX, XLS, XLSX, PPT,
              PPTX
            </Typography>
            <Box mt={2}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Typography variant="body2" color="primary">
                  Download file instead
                </Typography>
              </a>
            </Box>
          </Box>
        );
    }
  };

  const getFileIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <PictureAsPdf sx={{ fontSize: 48, color: 'error.main' }} />;
      case 'word':
        return <Description sx={{ fontSize: 48, color: 'info.main' }} />;
      case 'excel':
        return <TableChart sx={{ fontSize: 48, color: 'success.main' }} />;
      case 'powerpoint':
        return <Slideshow sx={{ fontSize: 48, color: 'warning.main' }} />;
      default:
        return <Description sx={{ fontSize: 48, color: 'text.secondary' }} />;
    }
  };

  const showZoomControls =
    fileType === 'image' ||
    (fileType === 'word' && !useOfficeViewer) ||
    fileType === 'excel';

  return (
    <Paper
      elevation={2}
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Toolbar */}
      {(showZoomControls || fileType !== 'unknown') && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showZoomControls && (
              <>
                <IconButton
                  size="small"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{ minWidth: '50px', textAlign: 'center' }}
                >
                  {Math.round(zoom * 100)}%
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn />
                </IconButton>
              </>
            )}
          </Box>
          <IconButton
            size="small"
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            title="Download"
          >
            <Download />
          </IconButton>
        </Box>
      )}

      {loading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          bgcolor="background.paper"
          zIndex={1}
        >
          {getFileIcon()}
          <CircularProgress sx={{ mt: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading document...
          </Typography>
        </Box>
      )}

      {error && showError && (
        <Box p={2}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
            <Box mt={1}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Typography variant="body2" color="primary">
                  Try downloading the file instead
                </Typography>
              </a>
            </Box>
          </Alert>
        </Box>
      )}

      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        sx={{
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        {!error && renderViewer()}
      </Box>
    </Paper>
  );
};

export default DocumentViewer;
