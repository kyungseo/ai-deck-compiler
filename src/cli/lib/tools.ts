import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { platform } from 'node:os';

export function findInPath(commands: string[]): string | null {
  for (const cmd of commands) {
    try {
      execFileSync(cmd, ['--version'], { stdio: 'pipe' });
      return cmd;
    } catch {}
  }
  return null;
}

export function findAbsolute(paths: string[]): string | null {
  for (const p of paths) {
    if (existsSync(p)) return p;
  }
  return null;
}

export function findSoffice(): string | null {
  const inPath = findInPath(['soffice', 'libreoffice']);
  if (inPath) return inPath;

  const os = platform();
  if (os === 'darwin') {
    return findAbsolute([
      '/Applications/LibreOffice.app/Contents/MacOS/soffice',
      `${process.env['HOME'] ?? ''}/Applications/LibreOffice.app/Contents/MacOS/soffice`,
    ]);
  }
  if (os === 'win32') {
    const pf   = process.env['ProgramFiles']      ?? 'C:\\Program Files';
    const pf86 = process.env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)';
    return findAbsolute([
      join(pf,   'LibreOffice', 'program', 'soffice.exe'),
      join(pf86, 'LibreOffice', 'program', 'soffice.exe'),
    ]);
  }
  return findAbsolute([
    '/usr/bin/soffice',
    '/usr/bin/libreoffice',
    '/usr/local/bin/soffice',
    '/snap/bin/libreoffice',
    '/opt/libreoffice/program/soffice',
  ]);
}

export function findPdftoppm(): string | null {
  const inPath = findInPath(['pdftoppm']);
  if (inPath) return inPath;

  const os = platform();
  if (os === 'darwin') {
    return findAbsolute([
      '/opt/homebrew/bin/pdftoppm',
      '/usr/local/bin/pdftoppm',
    ]);
  }
  if (os === 'win32') {
    return findAbsolute([
      'C:\\Program Files\\poppler\\bin\\pdftoppm.exe',
      'C:\\poppler\\bin\\pdftoppm.exe',
    ]);
  }
  return findAbsolute([
    '/usr/bin/pdftoppm',
    '/usr/local/bin/pdftoppm',
  ]);
}

export function sofficeHint(): string {
  const os = platform();
  if (os === 'darwin') return '  brew install --cask libreoffice';
  if (os === 'win32')  return '  https://www.libreoffice.org/download/';
  return [
    '  Ubuntu/Debian: sudo apt install libreoffice',
    '  Fedora/RHEL:   sudo dnf install libreoffice',
    '  Arch:          sudo pacman -S libreoffice-still',
  ].join('\n');
}

export function pdftoppmHint(): string {
  const os = platform();
  if (os === 'darwin') return '  brew install poppler';
  if (os === 'win32')  return '  https://github.com/oschwartz10612/poppler-windows/releases';
  return [
    '  Ubuntu/Debian: sudo apt install poppler-utils',
    '  Fedora/RHEL:   sudo dnf install poppler-utils',
    '  Arch:          sudo pacman -S poppler',
  ].join('\n');
}
