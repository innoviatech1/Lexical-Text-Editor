import React, { useEffect, useRef, cloneElement } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !contentRef.current?.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  return (
    <div className="popover-root">
      {/*
        Pass refs to trigger/content via props
        so child components can attach them
      */}
      {React.Children.map(children, (child) => {
        if (!child || typeof child !== "object") return child;

        if ((child as any).type === PopoverTrigger) {
          return cloneElement(child as any, { triggerRef });
        }

        if ((child as any).type === PopoverContent) {
          return cloneElement(child as any, { contentRef, triggerRef });
        }

        return child;
      })}
    </div>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

export function PopoverTrigger({ children, triggerRef }: PopoverTriggerProps) {
  return (
    <div className="popover-trigger" ref={triggerRef}>
      {children}
    </div>
  );
}

interface PopoverContentProps {
  open: boolean;
  align?: "start" | "center" | "end";
  onClose: () => void;
  children: React.ReactNode;
  contentRef: React.RefObject<HTMLDivElement | null>;
  triggerRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Renders the popover panel portaled to <body> with fixed positioning,
 * because annotating inline (absolute inside the trigger's wrapper) makes it
 * vanish: the toolbar row is a scroll container (`overflow-x auto /
 * overflow-y hidden`) in every single-row variant, and clipping of that
 * kind cannot be escaped with pure CSS. The outside-mousedown close logic
 * in `Popover` is document-level, so it keeps working with the portal.
 */
export function PopoverContent({
  open,
  align = "start",
  children,
  contentRef,
  triggerRef,
}: PopoverContentProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [dark, setDark] = React.useState(false);

  // Position the fixed panel under the trigger; recompute on scroll/resize
  // (the editor content scrolls independently and can move the trigger).
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const wrapper = wrapperRef.current;
      const trig = triggerRef?.current;
      if (!wrapper || !trig) return;
      // mirror the editor's theme scope so scoped styles (incl. dark) apply
      const editorRoot = trig.closest(".lexical-text-editor");
      const isDark = !!editorRoot?.classList.contains("lexical-dark");
      if (wrapper.classList.contains("lexical-dark") !== isDark) {
        wrapper.classList.toggle("lexical-dark", isDark);
      }
      const r = trig.getBoundingClientRect();
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      let left = r.left;
      if (align === "center") left = r.left + r.width / 2 - w / 2;
      else if (align === "end") left = r.right - w;
      left = Math.max(8, Math.min(window.innerWidth - w - 8, left));
      let top = r.bottom + 4;
      // flip above when not enough room below and there is room above
      if (top + h > window.innerHeight - 8 && r.top > h + 8) top = r.top - h - 4;
      wrapper.style.left = `${left}px`;
      wrapper.style.top = `${top}px`;
      setDark(isDark);
    };
    update();
    // next frame: fonts/measures may shift the size after first paint
    requestAnimationFrame(update);
    window.addEventListener("resize", update);
    document.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      document.removeEventListener("scroll", update, true);
    };
  }, [open, align, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={wrapperRef}
      className={`lexical-text-editor${dark ? " lexical-dark" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        background: "transparent",
        border: "none",
        borderRadius: 0,
        boxShadow: "none",
        padding: 0,
        margin: 0,
        height: "fit-content",
        maxWidth: "none",
      }}
    >
      <div
        ref={(node) => {
          (contentRef as { current: HTMLDivElement | null }).current = node;
        }}
        className="popover-content"
        style={{ position: "static", top: "auto", left: "auto", borderRadius: 6, border: "none", boxShadow: "none", margin: 0, width: "100%" }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
