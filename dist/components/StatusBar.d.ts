interface StatusBarProps {
    showWordCount?: boolean;
    showCharCount?: boolean;
}
/**
 * Live word / character count computed from the editor state text.
 * Decorator nodes (images, video embeds) contribute no text, matching
 * conventional word-count behavior.
 */
export default function StatusBar({ showWordCount, showCharCount }: StatusBarProps): import("react/jsx-runtime").JSX.Element;
export {};
