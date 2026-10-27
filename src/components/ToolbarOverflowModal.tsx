import { useEffect, useRef, type ReactNode, type RefObject } from "react";

interface ToolbarOverflowModalProps {
  /** Ref of the ellipsis toggle — clicks on it are ignored so the button's own onClick handles toggling. */
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Dropdown panel hosting the toolbar tools that no longer fit inline.
 * Anchored below the toolbar's right edge (under the "..." button), no
 * overlay — closes on Escape or outside click. Tools stay mounted here (not
 * duplicated inline) so plugin listeners are never registered twice.
 */
export default function ToolbarOverflowModal({ anchorRef, onClose, children }: ToolbarOverflowModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current && !panelRef.current.contains(target) &&
        !(anchorRef.current && anchorRef.current.contains(target))) {
        onClose();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [anchorRef, onClose]);

  return (
    <div ref={panelRef} className="lte-overflow-panel">
      <div className="lte-overflow-grid">
        {children}
      </div>
    </div>
  );
}
