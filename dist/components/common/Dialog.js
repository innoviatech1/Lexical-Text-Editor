import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export default function RawDialog({ open, onClose, forPreview = false, children }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const handleOutsideClick = (e) => {
            if (dialogRef.current && !dialogRef.current.contains(e.target)) {
                onClose();
            }
        };
        const handleEsc = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [open, onClose]);
    if (!open)
        return null;
    return (_jsx("div", { className: "lexical-text-editor-dialog lte-dialog-overlay", children: _jsxs("div", { ref: dialogRef, className: `lte-dialog ${forPreview ? 'preview' : ''}`, children: [_jsx("button", { type: "button", className: "lte-dialog-close", onClick: onClose, children: "\u00D7" }), children] }) }));
}
