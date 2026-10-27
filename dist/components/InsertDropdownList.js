import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger, } from "./ui/popover";
// import { RichTextAction } from "constants";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { HiChevronDown } from "react-icons/hi2";
// interface Props {
//   onAction: (id: RichTextAction) => void,
//   selectionMap: {
//     [id: string]: boolean;
//   }
// }
export function InsertDropdownList({}) {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs(Popover, { open: isOpen, onOpenChange: (s) => setIsOpen(s), children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: isOpen ? "toolbarActive" : "toolbar", onClick: () => setIsOpen(!isOpen), size: "icon", className: "size-8 w-fit p-2 select-none border-[1px] border-gray-100", children: [_jsx(BsPlus, {}), " ", _jsx("span", { children: "Insert" }), " ", _jsx(HiChevronDown, { className: ` transition-normal duration-100 ${isOpen ? "rotate-180" : "rotate-0"}` })] }) }), _jsx(PopoverContent, { className: "p-2 w-fit flex flex-col items-start gap-1" })] }));
}
