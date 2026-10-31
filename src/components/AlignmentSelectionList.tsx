

import { RICH_ALIGNMENT_OPTIONS, RichTextAction } from "../constants/index";

import { useRef, useState } from "react"
import { HiChevronDown } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "./common/Popover";

interface Props {
  onAction: (id: RichTextAction) => void;
  alignmentSelectionMap: {
    [id: string]: boolean;
  }
}
export function AlignmentSelectionList({ onAction, alignmentSelectionMap }: Props) {
  const activeAlignment = RICH_ALIGNMENT_OPTIONS.find(h => alignmentSelectionMap[h.id])
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger triggerRef={triggerRef}>
        <button type="button"
          className={`lexical-btn heading-trigger ${isOpen ? "toolbar-active" : "toolbar"}`}
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            minWidth: 146
          }}
        >
          {activeAlignment?.icon}
          <span>{activeAlignment?.label}</span>
          <HiChevronDown className={`chevron ${isOpen ? "rotated" : ""}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent open={isOpen} align="start" onClose={() => setIsOpen(false)} contentRef={contentRef}>
        <div
          style={{
            display: 'flex', flexDirection: 'column', gap: 5
          }}>
          {
            RICH_ALIGNMENT_OPTIONS.map(({ id, label, icon }) => (
              <button type="button"
                key={id}
                className={`lexical-btn ${alignmentSelectionMap[id] ? "toolbar-active" : "toolbar"
                  }`}
                onClick={() => {
                  onAction(id);
                  setIsOpen(false)
                }}
              >
                {icon}
                <span className="label">{label}</span>
              </button>
            ))
          }
        </div>
      </PopoverContent>
    </Popover>
  )
}
