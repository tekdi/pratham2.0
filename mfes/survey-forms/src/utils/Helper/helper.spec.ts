import { formatDDMMYYYY, formatDDMMYYYYWithTime } from './helper';

describe('formatDDMMYYYY — submission date format', () => {
  it('formats a date as DD/MM/YYYY, zero-padded', () => {
    expect(formatDDMMYYYY('2026-08-13T12:31:00.306Z')).toBe('13/08/2026');
  });

  it('zero-pads single-digit day and month', () => {
    expect(formatDDMMYYYY('2026-01-05T12:00:00.000Z')).toBe('05/01/2026');
  });
});

describe('formatDDMMYYYYWithTime — submission date+time format', () => {
  it('prefixes the DD/MM/YYYY date before the time', () => {
    const result = formatDDMMYYYYWithTime('2026-08-13T12:31:00.306Z');
    expect(result.startsWith('13/08/2026, ')).toBe(true);
  });
});
