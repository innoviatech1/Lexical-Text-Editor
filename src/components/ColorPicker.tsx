import { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import { createPortal } from "react-dom";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  icon: React.ReactElement;
}

export default function ColorPicker({ color, onChange, icon }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const preventFocus = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="color-picker-wrapper">
      <button type="button"
        ref={triggerRef}
        className={`size-10 lexical-btn ${open ? "toolbarActive" : "toolbar"} icon`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {icon}
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className={`lexical-color-popover ${open ? "open" : ""}`}
            style={{
              top: triggerRef.current?.getBoundingClientRect().bottom,
              left: triggerRef.current?.getBoundingClientRect().left,
              position: "absolute",
            }}
            onMouseDown={preventFocus}
          >
            <SketchPicker
              color={color}
              onChangeComplete={(c: any) => {
                onChange(c.hex);
              }}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
