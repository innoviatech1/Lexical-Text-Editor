export declare const ToolbarPlugin: ({ value, onImageUpload, sourceView, onToggleSourceView, fullscreen, onToggleFullscreen, toolbarStyle, }: {
    value: string;
    onImageUpload?: (file: File) => Promise<string>;
    sourceView?: boolean;
    onToggleSourceView?: () => void;
    fullscreen?: boolean;
    onToggleFullscreen?: () => void;
    /**
     * 'collapse' (default) — single row; overflowed segments collapse into the
     *   "..." button + modal (predictive fit per COLLAPSIBLE_IDS priority).
     * 'wrap' — all tools flow serially; overflow wraps to the next line.
     * 'scrollbar' — single horizontal row with a slim scrollbar.
     * 'normal' — deprecated alias for 'collapse'.
     */
    toolbarStyle?: "wrap" | "collapse" | "scrollbar" | "normal";
}) => import("react/jsx-runtime").JSX.Element;
