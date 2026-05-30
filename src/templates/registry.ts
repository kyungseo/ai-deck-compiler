import type { NormalizedSlide, ResolvedDesignTokens } from '../compiler/types';

// Structural stub for a pptxgenjs Slide instance.
// Work 2 will replace this with the actual pptxgenjs.Slide type.
export interface PptxSlide {
  addText(text: string | unknown[], opts?: unknown): this;
  addShape(shapeType: string, opts?: unknown): this;
  addChart(type: string, data: unknown[], opts?: unknown): this;
  addTable(rows: unknown[][], opts?: unknown): this;
  addImage(opts: unknown): this;
}

export type RenderFn<T extends NormalizedSlide = NormalizedSlide> = (
  slide: T,
  tokens: ResolvedDesignTokens,
  pptxSlide: PptxSlide
) => void;

export interface SlideTemplate<T extends NormalizedSlide = NormalizedSlide> {
  id: string;
  supportedType: T['type'];
  variants: string[];
  render: RenderFn<T>;
}

export class TemplateRegistry {
  private readonly templates = new Map<string, SlideTemplate>();

  register(template: SlideTemplate): void {
    this.templates.set(template.id, template);
  }

  // Resolves by `type` or `type:variant`. Throws if not found — no silent fallback.
  resolve(type: string, variant?: string): SlideTemplate {
    const key = variant ? `${type}:${variant}` : type;
    const template = this.templates.get(key) ?? this.templates.get(type);
    if (!template) {
      throw new Error(
        `No template registered for slide type "${type}"` +
        (variant ? ` (variant: "${variant}")` : '')
      );
    }
    return template;
  }

  has(type: string, variant?: string): boolean {
    const key = variant ? `${type}:${variant}` : type;
    return this.templates.has(key) || this.templates.has(type);
  }

  registeredIds(): string[] {
    return Array.from(this.templates.keys());
  }
}
