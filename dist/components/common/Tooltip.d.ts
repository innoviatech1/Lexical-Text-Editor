import React, { ReactNode } from "react";
import '../../styles/lexical-editor.css';
interface TooltipProps {
    content: ReactNode;
    direction?: "top" | "right" | "bottom" | "left";
    delay?: number;
    children: ReactNode;
}
/**
 * Hover tooltip. The tip is portaled to <body> and positioned `fixed`,
 * because annotating inline (absolute inside the hovered wrapper) makes it
 * vanish: the toolbar row (and other scroll containers) clip with
 * `overflow: hidden/auto`, and a CSS-only workaround is impossible
 * (visible+auto clipping overflow can't be combined).
 */
declare const TooltipX: React.FC<TooltipProps>;
export default TooltipX;
