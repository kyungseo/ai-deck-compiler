import type { Blueprint, Slide, Deck } from '../schema/blueprint';

export type { Blueprint, Slide, Deck };

export type NormalizedDeck = Blueprint['deck'];
export type NormalizedSlide = Slide;

export type TypographyToken = {
  size: number;
  bold?: boolean;
  italic?: boolean;
  font?: string;
  color?: string;
};

export type ResolvedDesignTokens = {
  colors: Record<string, string>;
  typography: Record<string, TypographyToken>;
  spacing: Record<string, number>;
  slideSize: { width: number; height: number };
  shapes: Record<string, string>; // node kind → pptxgenjs shape name
};
