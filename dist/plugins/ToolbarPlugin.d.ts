export declare const ToolbarPlugin: ({ value, onImageUpload, sourceView, onToggleSourceView, fullscreen, onToggleFullscreen, toolbarStyle, }: {
    value: string;
    onImageUpload?: (file: File) => Promise<string>;
    sourceView?: boolean;
    onToggleSourceView?: () => void;
    fullscreen?: boolean;
    onToggleFullscreen?: () => void;
    toolbarStyle?: "normal" | "scrollbar";
}) => import("react/jsx-runtime").JSX.Element;
