import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RICH_TEXT_FORMAT_OPTIONS } from "../constants/index";
import { useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "./common/Popover";
export function DropdownList({ onAction, selectionMap }) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    return (_jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(PopoverTrigger, { triggerRef: triggerRef, children: _jsxs("button", { type: "button", className: `lexical-btn heading-trigger ${isOpen ? "toolbar-active" : "toolbar"}`, onClick: () => setIsOpen((prev) => !prev), children: [_jsx("span", { children: "Aa" }), _jsx(HiChevronDown, { className: `chevron ${isOpen ? "rotated" : ""}` })] }) }), _jsx(PopoverContent, { open: isOpen, align: "start", onClose: () => setIsOpen(false), contentRef: contentRef, children: _jsx("div", { style: {
                        display: 'flex', flexDirection: 'column', gap: 5
                    }, children: RICH_TEXT_FORMAT_OPTIONS.map(({ id, label, icon }) => (_jsxs("button", { type: "button", className: `lexical-btn ${selectionMap[id] ? "toolbar-active" : "toolbar"}`, onClick: () => {
                            onAction(id);
                            setIsOpen(false);
                        }, style: {
                            minWidth: 130
                        }, children: [icon, _jsx("span", { className: "label", children: label })] }, id))) }) })] }));
}
