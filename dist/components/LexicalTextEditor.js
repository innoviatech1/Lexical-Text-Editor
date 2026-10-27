import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { TextNode } from "lexical";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ToolbarPlugin } from "../plugins/ToolbarPlugin";
import { LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import CustomOnChangePlugin from "../plugins/CustomOnChangePlugin";
import SourceView from "./SourceView";
import StatusBar from "./StatusBar";
import { ImageNode } from "../nodes/ImageNode";
import { YoutubeNode } from "../nodes/YoutubeNode";
import { VideoNode } from "../nodes/VideoNode";
import "../styles/lexical-editor.css";
import { ExtendedTextNode } from "../nodes/ExtendedTextNode";
const theme = {
    text: {
        bold: "lexical-bold",
        underline: "lexical-underline",
        italic: "lexical-italic",
        strikethrough: "lexical-strikethrough",
        underlineStrikethrough: "lexical-underline-strikethrough",
        uppercase: "lexical-uppercase",
        lowercase: "lexical-lowercase",
        capitalize: "lexical-capitalize",
        code: "lexical-code",
    },
    paragraph: "lexical-paragraph",
    list: {
        ul: "lexical-list-ul",
        ol: "lexical-list-ol",
        listitem: "lexical-listitem",
    },
    quote: "lexical-quote",
    link: "lexical-link",
    code: "lexical-code-block",
    hr: "lexical-hr",
    indent: "lexical-indent",
    table: "lexical-table",
    tableRow: "lexical-table-row",
    tableCell: "lexical-table-cell",
    codeHighlight: {
        keyword: "lexical-code-token-keyword",
        string: "lexical-code-token-string",
        number: "lexical-code-token-number",
        comment: "lexical-code-token-comment",
        function: "lexical-code-token-function",
        operator: "lexical-code-token-operator",
        punctuation: "lexical-code-token-punctuation",
    },
};
export const LexicalTextEditor = React.memo(function LexicalTextEditor({ name, value, onChange, placeholder, maxWidth = null, height = null, onImageUpload, showWordCount = true, showCharCount = true, }) {
    const [sourceView, setSourceView] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const sourceViewApplyRef = useRef(null);
    const toggleSourceView = () => {
        setSourceView((prev) => {
            if (prev) {
                // Exit: apply pending source edits before leaving source view
                sourceViewApplyRef.current?.();
                return false;
            }
            return true;
        });
    };
    const toggleFullscreen = () => {
        setFullscreen((prev) => !prev);
    };
    // Escape exits fullscreen
    useEffect(() => {
        if (!fullscreen)
            return;
        const onKeyDown = (event) => {
            if (event.key === "Escape")
                setFullscreen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [fullscreen]);
    const initialConfig = useMemo(() => ({
        namespace: name,
        theme: theme,
        onError: (error) => {
            console.error("Lexical error:", error);
        },
        nodes: [
            ExtendedTextNode,
            {
                replace: TextNode,
                with: (node) => new ExtendedTextNode(node.__text),
                withKlass: ExtendedTextNode,
            },
            HeadingNode,
            CodeHighlightNode,
            CodeNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            LinkNode,
            ImageNode,
            YoutubeNode,
            VideoNode,
            HorizontalRuleNode,
            TableNode,
            TableRowNode,
            TableCellNode
        ],
    }), [name]);
    return (_jsx("div", { className: `lexical-text-editor lexical-editor-container ${fullscreen ? "lexical-fullscreen" : ""}`, style: {
            maxWidth: fullscreen ? 'none' : (maxWidth ? maxWidth : '1090px'),
        }, children: _jsxs(LexicalComposer, { initialConfig: initialConfig, children: [_jsx("div", { className: "lexical-toolbar-container", children: _jsx(ToolbarPlugin, { value: value, onImageUpload: onImageUpload, sourceView: sourceView, onToggleSourceView: toggleSourceView, fullscreen: fullscreen, onToggleFullscreen: toggleFullscreen }) }), _jsx("div", { className: "lexical-editor-inner", style: sourceView ? { display: 'none' } : undefined, children: _jsx(RichTextPlugin, { contentEditable: _jsx(ContentEditable, { className: "lexical-content-editable", style: {
                                height: height ? height : '500px',
                            } }), placeholder: _jsx("div", { className: "lexical-placeholder", children: placeholder || "Some Text" }), ErrorBoundary: LexicalErrorBoundary }) }), sourceView &&
                    _jsx(SourceView, { applyRef: sourceViewApplyRef, onExit: () => setSourceView(false) }), (showWordCount || showCharCount) &&
                    _jsx(StatusBar, { showWordCount: showWordCount, showCharCount: showCharCount }), _jsx(HistoryPlugin, {}), _jsx(ListPlugin, {}), _jsx(LexicalTablePlugin, {}), _jsx(HorizontalRulePlugin, {}), _jsx(LinkPlugin, {}), _jsx(CustomOnChangePlugin, { value: value, onChange: onChange })] }) }));
});
