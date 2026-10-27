import { jsxs as _jsxs } from "react/jsx-runtime";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect, useState } from "react";
/**
 * Live word / character count computed from the editor state text.
 * Decorator nodes (images, video embeds) contribute no text, matching
 * conventional word-count behavior.
 */
export default function StatusBar({ showWordCount = true, showCharCount = true }) {
    const [editor] = useLexicalComposerContext();
    const [counts, setCounts] = useState({ words: 0, chars: 0 });
    useEffect(() => {
        const compute = (editorState) => {
            editorState.read(() => {
                const text = $getRoot().getTextContent();
                const trimmed = text.trim();
                setCounts({
                    words: trimmed ? trimmed.split(/\s+/).length : 0,
                    chars: text.length,
                });
            });
        };
        compute(editor.getEditorState());
        return editor.registerUpdateListener(({ editorState }) => {
            compute(editorState);
        });
    }, [editor]);
    return (_jsxs("div", { className: "lexical-status-bar", children: [showWordCount && _jsxs("span", { children: [counts.words, " words"] }), showCharCount && _jsxs("span", { children: [counts.chars, " characters"] })] }));
}
