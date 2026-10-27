import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "./common/Popover";
export function FontSelectionList({ icon, tooltipLabel, currentValue, options, onSelect, minWidth = 132 }) {
    const activeOption = options.find((option) => option.id !== "" && option.id === currentValue);
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { triggerRef: triggerRef, children: _jsxs("button", { type: "button", "aria-label": tooltipLabel, className: `lexical-btn heading-trigger font-trigger ${open ? "toolbar-active" : "toolbar"}`, style: { minWidth }, onClick: () => setOpen((prev) => !prev), children: [icon, _jsx("span", { children: activeOption?.label ?? "Default" }), _jsx(HiChevronDown, { className: `chevron ${open ? "rotated" : ""}` })] }) }), _jsx(PopoverContent, { open: open, align: "start", onClose: () => setOpen(false), contentRef: contentRef, children: _jsx("div", { style: {
                        display: 'flex', flexDirection: 'column', gap: 5
                    }, children: options.map((option) => (_jsx("button", { type: "button", className: `lexical-btn ${option.id === "" && currentValue === "" ? "toolbar-active"
                            : option.id !== "" && option.id === currentValue ? "toolbar-active" : "toolbar"}`, onClick: () => {
                            onSelect(option.id);
                            setOpen(false);
                        }, children: _jsx("span", { className: "label", children: option.label }) }, option.label))) }) })] }));
}
