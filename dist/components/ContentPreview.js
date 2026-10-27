import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { VscPreview } from "react-icons/vsc";
import RawDialog from "./common/Dialog";
export function HtmlPreview({ value }) {
    return (_jsx("div", { className: "lexical-text-editor-html-preview", dangerouslySetInnerHTML: { __html: value } }));
}
export default function ContentPreviewDialog({ value, triggerLabel = "Preview", }) {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs("div", { className: "lexical-text-editor-dialog", children: [_jsxs("button", { type: "button", className: `lexical-btn heading-trigger ${isOpen ? "toolbar-active" : "toolbar"}`, onClick: () => setIsOpen((prev) => !prev), children: [_jsx(VscPreview, { size: 18 }), _jsx("span", { children: triggerLabel })] }), _jsxs(RawDialog, { open: isOpen, onClose: () => setIsOpen(false), forPreview: true, children: [_jsx("div", { className: "lte-dialog-header", children: "Content Preview" }), _jsxs("div", { className: "lte-preview-container", children: [_jsx("div", { className: "lte-preview-title", children: "CONTENT" }), _jsx(HtmlPreview, { value: value })] })] })] }));
}
