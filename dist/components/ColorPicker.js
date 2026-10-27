import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import { createPortal } from "react-dom";
export default function ColorPicker({ color, onChange, icon }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const preventFocus = (e) => e.preventDefault();
    return (_jsxs("div", { className: "color-picker-wrapper", children: [_jsx("button", { type: "button", ref: triggerRef, className: `size-8 lexical-btn ${open ? "toolbarActive" : "toolbar"} icon`, onClick: () => setOpen((prev) => !prev), children: icon }), open &&
                createPortal(_jsx("div", { ref: popoverRef, className: `lexical-color-popover ${open ? "open" : ""}`, style: {
                        top: triggerRef.current?.getBoundingClientRect().bottom,
                        left: triggerRef.current?.getBoundingClientRect().left,
                        position: "absolute",
                    }, onMouseDown: preventFocus, children: _jsx(SketchPicker, { color: color, onChangeComplete: (c) => {
                            onChange(c.hex);
                        } }) }), document.body)] }));
}
