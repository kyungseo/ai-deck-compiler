import type { NormalizedSlide, ResolvedDesignTokens } from '../compiler/types';

// Structural interface for a pptxgenjs Slide instance.
// The actual pptxgenjs Slide is passed at runtime; this interface documents
// the methods templates use and enables type-safe template authoring.
export interface PptxSlide {
  background: unknown;
  addText(text: string | unknown[], opts?: unknown): this;
  addShape(shapeType: string, opts?: unknown): this;
  addChart(type: string, data: unknown[], opts?: unknown): this;
  addTable(rows: unknown[][], opts?: unknown): this;
  addImage(opts: unknown): this;
  addNotes(notes: string): this;
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

  // Accepts a strongly-typed SlideTemplate<T> and stores it as the base union type.
  // Safe because resolve() dispatches only the matching slide type to each template.
  register<T extends NormalizedSlide>(template: SlideTemplate<T>): void {
    this.templates.set(template.id, template as unknown as SlideTemplate);
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
