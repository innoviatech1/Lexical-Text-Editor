import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useRef, cloneElement } from "react";
export function Popover({ open, onOpenChange, children }) {
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    // Close on outside click
    useEffect(() => {
        function handleClick(e) {
            if (!triggerRef.current?.contains(e.target) &&
                !contentRef.current?.contains(e.target)) {
                onOpenChange(false);
            }
        }
        if (open)
            document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onOpenChange]);
    return (_jsx("div", { className: "popover-root", children: React.Children.map(children, (child) => {
            if (!child || typeof child !== "object")
                return child;
            if (child.type === PopoverTrigger) {
                return cloneElement(child, { triggerRef });
            }
            if (child.type === PopoverContent) {
                return cloneElement(child, { contentRef });
            }
            return child;
        }) }));
}
export function PopoverTrigger({ children, triggerRef }) {
    return (_jsx("div", { className: "popover-trigger", ref: triggerRef, children: children }));
}
export function PopoverContent({ open, align = "start", children, contentRef, }) {
    if (!open)
        return null;
    return (_jsx("div", { ref: contentRef, className: `popover-content align-${align}`, children: children }));
}
