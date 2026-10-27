import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HEADINGS } from "../constants/index";
import { useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "./common/Popover";
export function HeadingSelectionList({ updateHeading, headingSelectionMap }) {
    const activeHeading = HEADINGS.find((h) => headingSelectionMap[h.id]);
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { triggerRef: triggerRef, children: _jsxs("button", { type: "button", className: `lexical-btn heading-trigger ${open ? "toolbar-active" : "toolbar"}`, onClick: () => setOpen((prev) => !prev), style: {
                        minWidth: 132
                    }, children: [activeHeading?.icon, _jsx("span", { children: activeHeading?.label }), _jsx(HiChevronDown, { className: `chevron ${open ? "rotated" : ""}` })] }) }), _jsx(PopoverContent, { open: open, align: "start", onClose: () => setOpen(false), contentRef: contentRef, children: _jsx("div", { style: {
                        display: 'flex', flexDirection: 'column', gap: 5
                    }, children: HEADINGS.map(({ id, label, icon }) => (_jsxs("button", { type: "button", className: `lexical-btn ${headingSelectionMap[id] ? "toolbar-active" : "toolbar"}`, onClick: () => {
                            updateHeading(id);
                            setOpen(false);
                        }, children: [icon, _jsx("span", { className: "label", children: label })] }, id))) }) })] }));
}
