export declare enum RichTextAction {
    Bold = "bold",
    Italics = "italics",
    Underline = "underline",
    Quote = "quote",
    Lowercase = "lowercase",
    Uppercase = "uppercase",
    Capitalize = "capitalize",
    Strikethrough = "strikethrough",
    Superscript = "superscript",
    Subscript = "subscript",
    Highlight = "highlight",
    Code = "code",
    Link = "link",
    LeftAlign = "leftAlign",
    CenterAlign = "centerAlign",
    RightAlign = "rightAlign",
    JustifyAlign = "justifyAlign",
    Divider = "divider",
    Undo = "undo",
    Redo = "redo",
    ClearFormatting = "clearFormatting",
    CodeBlock = "codeBlock",
    HorizontalRule = "horizontalRule",
    Indent = "indent",
    Outdent = "outdent",
    Table = "table",
    FindReplace = "findReplace",
    SourceView = "sourceView",
    Fullscreen = "fullscreen"
}
export declare enum HeadingAction {
    Normal = "normal",
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6"
}
export declare const RICH_TEXT_FORMAT_OPTIONS: ({
    id: RichTextAction;
    icon: import("react/jsx-runtime").JSX.Element;
    label: string;
    fontSize?: undefined;
} | {
    id: RichTextAction;
    icon: import("react/jsx-runtime").JSX.Element;
    label: string;
    fontSize: number;
})[];
export declare const RICH_TEXT_OPTIONS: ({
    id: RichTextAction;
    icon: import("react/jsx-runtime").JSX.Element;
    label: string;
} | {
    id: RichTextAction;
    icon?: undefined;
    label?: undefined;
})[];
export declare const RICH_REDO_UNDO_OPTIONS: ({
    id: RichTextAction;
    icon: import("react/jsx-runtime").JSX.Element;
    label: string;
} | {
    id: RichTextAction;
    icon?: undefined;
    label?: undefined;
})[];
export declare const RICH_ALIGNMENT_OPTIONS: {
    id: RichTextAction;
    icon: import("react/jsx-runtime").JSX.Element;
    label: string;
}[];
export declare const RICH_BLOCK_OPTIONS: ({
    id: RichTextAction;
    icon: import("react/jsx-runtime").JSX.Element;
    label: string;
} | {
    id: RichTextAction;
    icon?: undefined;
    label?: undefined;
})[];
export declare const LOW_PRIORIRTY = 1;
export declare const HEADINGS: {
    id: string;
    label: string;
    icon: import("react/jsx-runtime").JSX.Element;
}[];
export declare const CODE_BLOCK_LANGUAGES: {
    id: string;
    label: string;
}[];
