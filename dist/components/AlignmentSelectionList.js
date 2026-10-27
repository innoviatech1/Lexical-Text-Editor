import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RICH_ALIGNMENT_OPTIONS } from "../constants/index";
import { useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "./common/Popover";
export function AlignmentSelectionList({ onAction, alignmentSelectionMap }) {
    const activeAlignment = RICH_ALIGNMENT_OPTIONS.find(h => alignmentSelectionMap[h.id]);
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    return (_jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(PopoverTrigger, { triggerRef: triggerRef, children: _jsxs("button", { type: "button", className: `lexical-btn heading-trigger ${isOpen ? "toolbar-active" : "toolbar"}`, onClick: () => setIsOpen((prev) => !prev), style: {
                        minWidth: 146
                    }, children: [activeAlignment?.icon, _jsx("span", { children: activeAlignment?.label }), _jsx(HiChevronDown, { className: `chevron ${isOpen ? "rotated" : ""}` })] }) }), _jsx(PopoverContent, { open: isOpen, align: "start", onClose: () => setIsOpen(false), contentRef: contentRef, children: _jsx("div", { style: {
                        display: 'flex', flexDirection: 'column', gap: 5
                    }, children: RICH_ALIGNMENT_OPTIONS.map(({ id, label, icon }) => (_jsxs("button", { type: "button", className: `lexical-btn ${alignmentSelectionMap[id] ? "toolbar-active" : "toolbar"}`, onClick: () => {
                            onAction(id);
                            setIsOpen(false);
                        }, children: [icon, _jsx("span", { className: "label", children: label })] }, id))) }) })] }));
}
