import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import { useEffect, useRef, useState } from "react";
import { MdCheck } from "react-icons/md";
import TooltipX from "./common/Tooltip";
/**
 * Raw HTML editing mode. The ContentEditable stays mounted (hidden) so the
 * editor state is preserved. Edited HTML is imported into the editor state
 * only on demand (Update / Done / toolbar toggle) — never per keystroke, so
 * undo history is not flooded and partially typed markup is not parsed.
 */
export default function SourceView({ applyRef, onExit }) {
    const [editor] = useLexicalComposerContext();
    const [html, setHtml] = useState(() => editor.getEditorState().read(() => $generateHtmlFromNodes(editor)));
    const lastImportedRef = useRef(html);
    const importHtml = (value) => {
        if (value === lastImportedRef.current)
            return;
        editor.update(() => {
            const root = $getRoot();
            root.clear();
            // Reset selection inside the emptied root so $insertNodes cannot
            // resolve a stale selection pointing at removed nodes.
            root.selectEnd();
            if (value) {
                const dom = new DOMParser().parseFromString(value, "text/html");
                const nodes = $generateNodesFromDOM(editor, dom);
                if (nodes.length > 0) {
                    $insertNodes(nodes);
                }
            }
        });
        lastImportedRef.current = value;
    };
    useEffect(() => {
        applyRef.current = () => {
            importHtml(html);
            onExit();
        };
        return () => {
            applyRef.current = null;
        };
    }, [applyRef, html, onExit, editor]);
    return (_jsxs("div", { className: "lexical-source-view", children: [_jsx("textarea", { className: "lexical-source-textarea", value: html, onChange: (e) => setHtml(e.target.value), "aria-label": "HTML source", spellCheck: false }), _jsxs("div", { className: "lexical-source-actions", children: [_jsx(TooltipX, { content: "Apply HTML to the editor", direction: "top", children: _jsxs("button", { type: "button", className: "lexical-btn heading-trigger toolbar", onClick: () => importHtml(html), children: [_jsx(MdCheck, { size: 16 }), _jsx("span", { className: "label", children: "Update" })] }) }), _jsx("button", { type: "button", className: "lexical-btn heading-trigger toolbar", onClick: () => {
                            importHtml(html);
                            onExit();
                        }, children: "Done" })] })] }));
}
