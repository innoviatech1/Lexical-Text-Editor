import React, { useState, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import '../../styles/lexical-editor.css'
interface TooltipProps {
  content: ReactNode;
  direction?: "top" | "right" | "bottom" | "left";
  delay?: number;
  children: ReactNode;
}

const GAP = 10; // px between the trigger edge and the tooltip box

/**
 * Hover tooltip. The tip is portaled to <body> and positioned `fixed`,
 * because annotating inline (absolute inside the hovered wrapper) makes it
 * vanish: the toolbar row (and other scroll containers) clip with
 * `overflow: hidden/auto`, and a CSS-only workaround is impossible
 * (visible+auto clipping overflow can't be combined).
 */
const TooltipX: React.FC<TooltipProps> = ({ content, direction = "top", delay = 400, children }) => {
  const [active, setActive] = useState(false);
  const [rect, setRect] = useState<{ left: number; top: number; right: number; bottom: number; width: number; height: number } | null>(null);
  const timeout = useRef<number | null>(null); // <-- browser setTimeout returns number
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const showTip = () => {
    timeout.current = window.setTimeout(() => {
      const el = wrapperRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height });
      }
      setActive(true);
    }, delay);
  };

  const hideTip = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    setActive(false);
  };

  if (!rect) {
    return (
      <div
        ref={wrapperRef}
        className="Lexical-Tooltip-Wrapper"
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
      >
        {children}
      </div>
    );
  }

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Fixed position computed from the trigger's rect; the shared CSS keeps
  // styling/arrows and its ::before arrows stay correct relative to the tip.
  const tipStyle: React.CSSProperties =
    direction === "bottom"
      ? { top: rect.bottom + GAP, left: centerX, bottom: "auto" }
      : direction === "top"
        ? { bottom: window.innerHeight - rect.top + GAP, top: "auto" , left: centerX}
        : direction === "right"
          ? { left: rect.right + GAP, right: "auto", top: centerY}
          : { left: "auto", right: window.innerWidth - rect.left + GAP, top: centerY };

  return (
    <div
      ref={wrapperRef}
      className="Lexical-Tooltip-Wrapper"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active &&
        createPortal(
          <div
            className={`Lexical-Tooltip-Tip ${direction}`}
            style={{ position: "fixed", pointerEvents: "none", ...(tipStyle as React.CSSProperties), zIndex: 10000 }}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};

export default TooltipX;
