import { useRef, useState, type ReactNode } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "./common/Popover";

export interface FontOption {
  /** CSS value applied to the selection. Empty string resets to default. */
  id: string;
  label: string;
}

interface Props {
  icon: ReactNode;
  tooltipLabel: string;
  /** Normalized current style value; empty string means "Default". */
  currentValue: string;
  options: FontOption[];
  onSelect: (value: string) => void;
  minWidth?: number;
}

export function FontSelectionList({
  icon,
  tooltipLabel,
  currentValue,
  options,
  onSelect,
  minWidth = 132
}: Props) {
  const activeOption = options.find((option) => option.id !== "" && option.id === currentValue);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger triggerRef={triggerRef}>
        <button type="button"
          aria-label={tooltipLabel}
          className={`lexical-btn heading-trigger font-trigger ${open ? "toolbar-active" : "toolbar"}`}
          style={{ minWidth }}
          onClick={() => setOpen((prev) => !prev)}
        >
          {icon}
          <span>{activeOption?.label ?? "Default"}</span>
          <HiChevronDown className={`chevron ${open ? "rotated" : ""}`} />
        </button>
      </PopoverTrigger>

      <PopoverContent open={open} align="start" onClose={() => setOpen(false)} contentRef={contentRef}>
        <div
          style={{
            display: 'flex', flexDirection: 'column', gap: 5
          }}>
          {options.map((option) => (
            <button type="button"
              key={option.label}
              className={`lexical-btn ${option.id === "" && currentValue === "" ? "toolbar-active"
                : option.id !== "" && option.id === currentValue ? "toolbar-active" : "toolbar"
                }`}
              onClick={() => {
                onSelect(option.id);
                setOpen(false);
              }}
            >
              <span className="label">{option.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
