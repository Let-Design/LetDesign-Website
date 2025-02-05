import { TFiller } from "fabric";

export interface ObjectProperty {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  fill: string | TFiller | null;
  type?: string;
}

export interface TextProperty extends ObjectProperty {
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  textDecoration?: {
    underline: boolean;
    strikethrough: boolean;
    overline: true;
  };
  fontStyle?: "" | "normal" | "italic" | "oblique";
  stroke?: string;
  strokeWidth?: number;
  textAlign?: string;
  lineHeight?: number;
}

export interface RectangleProperty extends ObjectProperty {
  cornerRadius?: number;
}

export interface CircleProperty extends ObjectProperty {
  radius?: number;
}

export type SelectedObjectProperty =
  | ObjectProperty
  | RectangleProperty
  | CircleProperty
  | TextProperty
  | null;
