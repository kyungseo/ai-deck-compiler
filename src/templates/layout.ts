import type { PptxSlide } from './registry.js';
import type { ResolvedDesignTokens } from '../compiler/types.js';

// Shared layout constants for LAYOUT_WIDE slides (13.33" × 7.5").
// All values in inches.
export const SL = {
  w:  13.33, // slide width
  h:   7.5,  // slide height
  mx:  0.67, // horizontal margin
  ty:  0.35, // title y (no section_label)
  th:  0.82, // title height (no section_label)
  cx:  0.67, // content x = margin
  cy:  1.35, // kept for zone calculations in architecture
  cw: 12.0,  // content width (w - mx*2)
  ch:  5.75, // kept for zone calculations in architecture
} as const;

// ── Card-based content area ──────────────────────────────────────────────────
// All content slides render a white card background over the slide background.
// Content lives inside the card with top padding.

export const CARD = {
  y:  1.75,  // card background Y
  h:  5.1,   // card height — bottom at 6.85 (footer at 7.15)
  iy: 2.05,  // inner content Y  (0.3 padding from card top)
  ih: 4.65,  // inner content height (ends at 6.70)
  px: 0.25,  // inner horizontal padding (content stays inside card edges)
} as const;

// Strip leading '#' — pptxgenjs expects hex without it.
export const hex = (c: string): string => (c.startsWith('#') ? c.slice(1) : c);

// ── Shared render helpers ────────────────────────────────────────────────────

type HeaderOpts = {
  title: string;
  section_label?: string;
  subtitle?: string;
};

/** Renders section label (optional), title, and subtitle (optional). */
export function renderSectionHeader(
  s: PptxSlide,
  opts: HeaderOpts,
  tokens: ResolvedDesignTokens,
): void {
  const { typography: ty, colors: co } = tokens;
  const primary = hex(co['text-primary'] ?? '111827');
  const secondary = hex(co['text-secondary'] ?? '374151');
  const font = ty['title']?.font ?? 'Pretendard';

  if (opts.section_label) {
    const chipBg = hex(co['chip-bg'] ?? co['accent'] ?? '2D6B5E');
    const chipText = hex(co['chip-text'] ?? 'FFFFFF');
    const chipW = Math.min(Math.max(1.0, opts.section_label.length * 0.10 + 0.40), 4.0);
    s.addShape('roundRect', {
      x: SL.mx, y: 0.20, w: chipW, h: 0.28,
      fill: { color: chipBg },
      line: { color: chipBg, width: 0 },
      rectRadius: 0.04,
    });
    s.addText(opts.section_label.toUpperCase(), {
      x: SL.mx + 0.14, y: 0.20, w: chipW - 0.28, h: 0.28,
      fontSize: 11,
      bold: true,
      fontFace: ty['label']?.font ?? 'Pretendard',
      color: chipText,
      valign: 'middle',
      align: 'left',
      wrap: false,
    });
  }

  const titleY = opts.section_label ? 0.62 : SL.ty;
  const titleH = opts.subtitle ? 0.60 : SL.th;

  s.addText(opts.title, {
    x: SL.cx, y: titleY, w: SL.cw, h: titleH,
    fontSize: ty['title']?.size ?? 40,
    bold: ty['title']?.bold ?? true,
    fontFace: font,
    color: primary,
    valign: 'middle',
  });

  if (opts.subtitle) {
    s.addText(opts.subtitle, {
      x: SL.cx, y: titleY + titleH + 0.05, w: SL.cw, h: 0.38,
      fontSize: 18,
      fontFace: ty['title']?.font ?? 'Pretendard',
      color: secondary,
      valign: 'middle',
    });
  }
}

/** Renders the white content card background (Apple-style: no border, depth from bg contrast). */
export function renderCardBackground(
  s: PptxSlide,
  tokens: ResolvedDesignTokens,
): void {
  const { colors: co } = tokens;
  s.addShape('rect', {
    x: SL.mx, y: CARD.y, w: SL.cw, h: CARD.h,
    fill: { color: hex(co['card-bg'] ?? 'FFFFFF') },
    line: { color: hex(co['card-bg'] ?? 'FFFFFF'), width: 0 },
  });
}

/** Renders a panel label (small accent bar + uppercase text) inside the card. */
export function renderPanelLabel(
  s: PptxSlide,
  label: string,
  x: number,
  tokens: ResolvedDesignTokens,
): void {
  const { typography: ty, colors: co } = tokens;
  const accent = hex(co['accent'] ?? '2563EB');
  s.addShape('rect', {
    x, y: CARD.iy, w: 0.08, h: 0.36,
    fill: { color: accent },
    line: { color: accent, width: 0 },
  });
  s.addText(label.toUpperCase(), {
    x: x + 0.18, y: CARD.iy, w: 5.5, h: 0.40,
    fontSize: 18,
    bold: true,
    fontFace: ty['label']?.font ?? 'Pretendard',
    color: accent,
    valign: 'middle',
  });
}

// ── Zone-based layout for architecture diagrams ──────────────────────────────

type Zone =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'left' | 'right';

// [col, row] — 0-indexed in a 3×3 grid
const ZONE_GRID: Record<Zone, [number, number]> = {
  'top-left':      [0, 0], 'top-center':    [1, 0], 'top-right':     [2, 0],
  'center-left':   [0, 1], 'center':        [1, 1], 'center-right':  [2, 1],
  'bottom-left':   [0, 2], 'bottom-center': [1, 2], 'bottom-right':  [2, 2],
  'left':          [0, 1], 'right':         [2, 1],
};

/** Renders a full-width callout bar at slide bottom. No-op if callout-bar token absent. */
export function renderCalloutBar(
  s: PptxSlide,
  callout: string,
  tokens: ResolvedDesignTokens,
): void {
  const { colors: co, typography: ty } = tokens;
  if (!co['callout-bar']) return;
  const bg = hex(co['callout-bar']);
  const fg = hex(co['callout-bar-text'] ?? 'FFFFFF');
  s.addShape('rect', {
    x: 0, y: 6.85, w: SL.w, h: 0.34,
    fill: { color: bg }, line: { color: bg, width: 0 },
  });
  s.addText(callout, {
    x: SL.mx, y: 6.85, w: SL.cw, h: 0.34,
    fontSize: ty['caption']?.size ?? 14,
    bold: true,
    fontFace: ty['caption']?.font ?? 'Pretendard',
    color: fg,
    valign: 'middle',
    align: 'center',
  });
}

type BodyBlockOptions = {
  fontSize?: number;
  color?: string;
  bullet?: boolean;
};

type CodeBlock = {
  lines: string[];
  lang?: string;
};

type CodeToken = {
  text: string;
  kind: 'plain' | 'keyword' | 'string' | 'comment' | 'number';
};

const isInlineCodeItem = (text: string): boolean =>
  text.startsWith('`') && text.endsWith('`') && !text.startsWith('```') && text.length > 2;

const isFencedCodeItem = (text: string): boolean =>
  text.trimStart().startsWith('```') && text.trimEnd().endsWith('```');

const parseCodeBlock = (items: string[]): CodeBlock => {
  if (items.length === 1 && isFencedCodeItem(items[0])) {
    const raw = items[0].trim();
    const withoutOpen = raw.replace(/^```[ \t]*/, '');
    const withoutClose = withoutOpen.replace(/[ \t]*```$/, '');
    const lines = withoutClose.split(/\r?\n/);
    const first = lines[0]?.trim() ?? '';
    const hasLang = /^[A-Za-z][\w.+-]*$/.test(first) && lines.length > 1;
    return {
      lang: hasLang ? first : undefined,
      lines: (hasLang ? lines.slice(1) : lines).filter((line, i, arr) => line.length > 0 || i < arr.length - 1),
    };
  }
  return { lines: items.map(text => isInlineCodeItem(text) ? text.slice(1, -1) : text) };
};

const isCodeItem = (text: string): boolean => isInlineCodeItem(text) || isFencedCodeItem(text);

// To add a language: extend the union, add a key in KEYWORDS, and update the comment-start check in tokenizeCodeLine.
const normalizeCodeLang = (lang?: string): 'bash' | 'js' | 'java' | undefined => {
  const normalized = lang?.toLowerCase();
  if (!normalized) return undefined;
  if (['bash', 'sh', 'shell', 'zsh'].includes(normalized)) return 'bash';
  if (['js', 'jsx', 'ts', 'tsx', 'javascript', 'typescript'].includes(normalized)) return 'js';
  if (normalized === 'java') return 'java';
  return undefined;
};

const KEYWORDS: Record<NonNullable<ReturnType<typeof normalizeCodeLang>>, Set<string>> = {
  bash: new Set([
    'if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac',
    'function', 'export', 'local', 'readonly', 'return', 'in',
  ]),
  js: new Set([
    'await', 'async', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
    'else', 'export', 'extends', 'finally', 'for', 'from', 'function', 'if', 'import',
    'interface', 'let', 'new', 'private', 'protected', 'public', 'return', 'static',
    'switch', 'throw', 'try', 'type', 'typeof', 'var', 'void', 'while',
  ]),
  java: new Set([
    'abstract', 'boolean', 'break', 'case', 'catch', 'class', 'const', 'continue',
    'default', 'else', 'enum', 'extends', 'final', 'finally', 'for', 'if', 'implements',
    'import', 'instanceof', 'interface', 'new', 'private', 'protected', 'public',
    'return', 'static', 'switch', 'this', 'throw', 'throws', 'try', 'void', 'while',
  ]),
};

const readQuotedString = (line: string, start: number): number => {
  const quote = line[start];
  let i = start + 1;
  while (i < line.length) {
    if (line[i] === '\\') {
      i += 2;
      continue;
    }
    if (line[i] === quote) return i + 1;
    i += 1;
  }
  return line.length;
};

const tokenizeCodeLine = (line: string, lang: NonNullable<ReturnType<typeof normalizeCodeLang>>): CodeToken[] => {
  const tokens: CodeToken[] = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);
    const commentStart = lang === 'bash' ? rest.startsWith('#') : rest.startsWith('//');
    if (commentStart) {
      tokens.push({ text: rest, kind: 'comment' });
      break;
    }
    if (line[i] === '"' || line[i] === '\'' || (lang === 'js' && line[i] === '`')) {
      const end = readQuotedString(line, i);
      tokens.push({ text: line.slice(i, end), kind: 'string' });
      i = end;
      continue;
    }
    const number = rest.match(/^\b\d+(?:\.\d+)?\b/);
    if (number) {
      tokens.push({ text: number[0], kind: 'number' });
      i += number[0].length;
      continue;
    }
    const word = rest.match(/^[A-Za-z_$][\w$]*/);
    if (word) {
      tokens.push({
        text: word[0],
        kind: KEYWORDS[lang].has(word[0]) ? 'keyword' : 'plain',
      });
      i += word[0].length;
      continue;
    }
    tokens.push({ text: line[i], kind: 'plain' });
    i += 1;
  }
  return tokens;
};

// charsPerInch: empirical for 11pt Courier New at slide scale (~11 glyphs/inch)
const estimateWrappedLines = (lines: string[], width: number, charsPerInch = 11): number => {
  const charsPerLine = Math.max(24, Math.floor(width * charsPerInch));
  return lines.reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
};

const estimateBulletHeight = (items: string[], width: number, fontSize: number): number => {
  // 7.8: empirical chars-per-inch for proportional body font (~16pt Pretendard)
  const charsPerLine = Math.max(24, Math.floor(width * 7.8));
  const lineH = Math.max(0.20, fontSize / 72 * 1.28);
  return items.reduce((sum, text) => {
    const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
    return sum + lines * lineH + 0.08;
  }, 0);
};

export function renderBodyWithCodeBlocks(
  s: PptxSlide,
  items: string[],
  tokens: ResolvedDesignTokens,
  bounds: { x: number; y: number; w: number; h: number },
  options: BodyBlockOptions = {},
): void {
  const { typography: ty, colors: co } = tokens;
  const bodyFontSize = options.fontSize ?? ty['body']?.size ?? 16;
  const bodyColor = options.color ?? hex(co['text-secondary'] ?? '374151');
  const codeColor = hex(co['accent-text'] ?? co['accent'] ?? '2563EB');
  const codeKeyword = hex(co['code-keyword'] ?? co['accent-alt'] ?? co['accent'] ?? '2563EB');
  const codeString = hex(co['code-string'] ?? co['success'] ?? codeColor);
  const codeComment = hex(co['code-comment'] ?? co['text-muted'] ?? '6B7280');
  const codeNumber = hex(co['code-number'] ?? co['chart-4'] ?? codeColor);
  const codeBg = hex(co['card-item-bg'] ?? '1E2124');
  const codeBorder = hex(co['border'] ?? '3A3F44');
  const maxY = bounds.y + bounds.h;
  let y = bounds.y;
  let i = 0;

  if (!items.some(isCodeItem)) {
    s.addText(items.map(text => ({
      text,
      options: {
        fontSize: bodyFontSize,
        fontFace: ty['body']?.font ?? 'Pretendard',
        color: bodyColor,
        bullet: options.bullet === false ? undefined : { code: '2022', indent: 15 },
        paraSpaceAfter: 8,
      },
    })), { x: bounds.x, y: bounds.y, w: bounds.w, h: bounds.h, valign: 'top' });
    return;
  }

  const renderBulletGroup = (group: string[]) => {
    if (group.length === 0 || y >= maxY) return;
    const estimatedH = Math.min(maxY - y, estimateBulletHeight(group, bounds.w, bodyFontSize));
    s.addText(group.map(text => ({
      text,
      options: {
        fontSize: bodyFontSize,
        fontFace: ty['body']?.font ?? 'Pretendard',
        color: bodyColor,
        bullet: options.bullet === false ? undefined : { code: '2022', indent: 15 },
        paraSpaceAfter: 8,
      },
    })), { x: bounds.x, y, w: bounds.w, h: estimatedH, valign: 'top' });
    y += estimatedH + 0.10;
  };

  const renderCodeGroup = (group: string[]) => {
    if (group.length === 0 || y >= maxY) return;
    const parsed = parseCodeBlock(group);
    const lines = parsed.lines.length > 0 ? parsed.lines : [''];
    const syntaxLang = normalizeCodeLang(parsed.lang);
    const pad = 0.14;
    const lineH = 0.20;
    const labelH = parsed.lang ? 0.22 : 0;
    const wrappedLines = estimateWrappedLines(lines, bounds.w - pad * 2);
    const boxH = Math.min(maxY - y, Math.max(0.50, wrappedLines * lineH + pad * 2 + labelH));
    if (boxH <= 0.16) return;

    s.addShape('roundRect', {
      x: bounds.x, y, w: bounds.w, h: boxH,
      fill: { color: codeBg },
      line: { color: codeBorder, width: 0.75 },
      rectRadius: 0.06,
    });

    if (parsed.lang) {
      s.addText(parsed.lang.toUpperCase(), {
        x: bounds.x + pad, y: y + 0.06, w: bounds.w - pad * 2, h: 0.18,
        fontSize: 8,
        bold: true,
        fontFace: ty['caption']?.font ?? 'Pretendard',
        color: hex(co['text-muted'] ?? '6B7280'),
        valign: 'middle',
      });
    }

    const tokenColor = (kind: CodeToken['kind']): string => {
      if (kind === 'keyword') return codeKeyword;
      if (kind === 'string') return codeString;
      if (kind === 'comment') return codeComment;
      if (kind === 'number') return codeNumber;
      return codeColor;
    };
    const textRuns = syntaxLang ? lines.flatMap((line, lineIndex) => {
      const lineTokens = tokenizeCodeLine(line, syntaxLang);
      const sourceTokens = lineTokens.length > 0 ? lineTokens : [{ text: '', kind: 'plain' as const }];
      return sourceTokens.map((token, tokenIndex) => ({
        text: token.text,
        options: {
          fontSize: 11,
          fontFace: 'Courier New',
          color: tokenColor(token.kind),
          breakLine: lineIndex < lines.length - 1 && tokenIndex === sourceTokens.length - 1,
        },
      }));
    }) : undefined;

    const textArea = {
      x: bounds.x + pad, y: y + pad + labelH,
      w: bounds.w - pad * 2, h: Math.max(0.1, boxH - pad * 2 - labelH),
      fontSize: 11, fontFace: 'Courier New', color: codeColor, valign: 'top' as const,
    };
    if (textRuns) {
      s.addText(textRuns, textArea);
    } else {
      s.addText(lines.join('\n'), textArea);
    }

    y += boxH + 0.16;
  };

  while (i < items.length && y < maxY) {
    if (isCodeItem(items[i])) {
      const codeItems: string[] = [];
      if (isFencedCodeItem(items[i])) {
        codeItems.push(items[i]);
        i += 1;
      } else {
        while (i < items.length && isInlineCodeItem(items[i])) {
          codeItems.push(items[i]);
          i += 1;
        }
      }
      renderCodeGroup(codeItems);
    } else {
      const bullets: string[] = [];
      while (i < items.length && !isCodeItem(items[i])) {
        bullets.push(items[i]);
        i += 1;
      }
      renderBulletGroup(bullets);
    }
  }
}

export function zoneCenter(zone: string): { cx: number; cy: number } {
  const entry = ZONE_GRID[zone as Zone] ?? [1, 1]; // default: center
  const [col, row] = entry;
  const innerW = SL.cw - CARD.px * 2;
  const cellW = innerW / 3;
  const cellH = CARD.ih / 3; // anchor to card inner area so top-row nodes stay inside card
  return {
    cx: SL.cx + CARD.px + cellW * col + cellW / 2,
    cy: CARD.iy + cellH * row + cellH / 2,
  };
}
