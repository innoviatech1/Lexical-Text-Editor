import React from "react";
import "../styles/lexical-editor.css";
export interface LexiTexProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    name: string;
    height?: string | null | undefined;
    maxWidth?: string | null | undefined;
    onImageUpload?: (file: File) => Promise<string>;
    showWordCount?: boolean;
    showCharCount?: boolean;
    theme?: 'light' | 'dark' | 'system';
    toolbarStyle?: 'normal' | 'scrollbar';
}
export declare const LexicalTextEditor: React.FC<LexiTexProps>;
