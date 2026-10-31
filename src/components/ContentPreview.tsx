import { useState } from "react";
import { VscPreview } from "react-icons/vsc";
import RawDialog from "./common/Dialog";
import TooltipX from "./common/Tooltip";

type HtmlPreviewProps = {
  value: string;
};

export function HtmlPreview({ value }: HtmlPreviewProps) {
  return (
    <div
      className="lexical-text-editor-html-preview"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}

type ContentPreviewDialogProps = {
  value: string;
  triggerLabel?: string;
};

export default function ContentPreviewDialog({
  value,
  triggerLabel = "Preview",
}: ContentPreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="lexical-text-editor-dialog">
      {/* Trigger button */}
      <TooltipX content={triggerLabel} direction="bottom">
        <button type="button"
          className={`lexical-btn heading-trigger ${isOpen ? "toolbar-active" : "toolbar"}`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <VscPreview size={18} />
          <span>{triggerLabel}</span>
        </button>
      </TooltipX>

      {/* Dialog */}
      <RawDialog open={isOpen} onClose={() => setIsOpen(false)} forPreview>
        <div className="lte-dialog-header">Content Preview</div>

        <div className="lte-preview-container">
          <div className="lte-preview-title">CONTENT</div>
          <HtmlPreview value={value} />
        </div>
      </RawDialog>
    </div>
  );
}
