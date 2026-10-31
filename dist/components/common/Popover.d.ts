import React from "react";
interface PopoverProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}
export declare function Popover({ open, onOpenChange, children }: PopoverProps): import("react/jsx-runtime").JSX.Element;
interface PopoverTriggerProps {
    children: React.ReactNode;
    triggerRef: React.RefObject<HTMLDivElement | null>;
}
export declare function PopoverTrigger({ children, triggerRef }: PopoverTriggerProps): import("react/jsx-runtime").JSX.Element;
interface PopoverContentProps {
    open: boolean;
    align?: "start" | "center" | "end";
    onClose: () => void;
    children: React.ReactNode;
    contentRef: React.RefObject<HTMLDivElement | null>;
    triggerRef?: React.RefObject<HTMLDivElement | null>;
}
/**
 * Renders the popover panel portaled to <body> with fixed positioning,
 * because annotating inline (absolute inside the trigger's wrapper) makes it
 * vanish: the toolbar row is a scroll container (`overflow-x auto /
 * overflow-y hidden`) in every single-row variant, and clipping of that
 * kind cannot be escaped with pure CSS. The outside-mousedown close logic
 * in `Popover` is document-level, so it keeps working with the portal.
 */
export declare function PopoverContent({ open, align, children, contentRef, triggerRef, }: PopoverContentProps): React.ReactPortal;
export {};
