import { type ReactNode, type RefObject } from "react";
interface ToolbarOverflowModalProps {
    /** Ref of the ellipsis toggle — clicks on it are ignored so the button's own onClick handles toggling. */
    anchorRef: RefObject<HTMLButtonElement | null>;
    onClose: () => void;
    children: ReactNode;
}
/**
 * Dropdown panel hosting the toolbar tools that no longer fit inline.
 * Anchored below the toolbar's right edge (under the "..." button), no
 * overlay — closes on Escape or outside click. Tools stay mounted here (not
 * duplicated inline) so plugin listeners are never registered twice.
 */
export default function ToolbarOverflowModal({ anchorRef, onClose, children }: ToolbarOverflowModalProps): import("react/jsx-runtime").JSX.Element;
export {};
