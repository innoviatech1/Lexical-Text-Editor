import { type ReactNode } from "react";
interface StatusBarProps {
    showWordCount?: boolean;
    showCharCount?: boolean;
    /** Optional right-aligned slot (e.g. display switchers) */
    rightSlot?: ReactNode;
}
/**
 * Live word / character count computed from the editor state text.
 * Decorator nodes (images, video embeds) contribute no text, matching
 * conventional word-count behavior.
 */
export default function StatusBar({ showWordCount, showCharCount, rightSlot }: StatusBarProps): import("react/jsx-runtime").JSX.Element;
export {};
