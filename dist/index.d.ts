import React from 'react';

interface LexiTexProps {
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
    toolbarStyle?: 'wrap' | 'collapse' | 'scrollbar' | 'normal';
    /** Show light/dark + toolbar-style switchers in the status bar so end users can change these too */
    showDisplayControls?: boolean;
    /** Fires when the end user changes the theme from the editor UI (not on prop changes) */
    onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
    /** Fires when the end user changes the toolbar style from the editor UI (not on prop changes) */
    onToolbarStyleChange?: (style: 'wrap' | 'collapse' | 'scrollbar') => void;
}
declare const LexicalTextEditor: React.FC<LexiTexProps>;

export { LexicalTextEditor };
export type { LexiTexProps as LexicalTextEditorProps };
