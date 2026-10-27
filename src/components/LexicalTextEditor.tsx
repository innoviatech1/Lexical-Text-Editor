import { LexicalComposer } from "@lexical/react/LexicalComposer"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { TextNode, type EditorThemeClasses } from "lexical"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { ListItemNode, ListNode } from "@lexical/list"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ToolbarPlugin } from "../plugins/ToolbarPlugin"
import { LinkNode } from "@lexical/link"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import CustomOnChangePlugin from "../plugins/CustomOnChangePlugin"
import SourceView from "./SourceView"
import StatusBar from "./StatusBar"
import { ImageNode } from "../nodes/ImageNode"
import { YoutubeNode } from "../nodes/YoutubeNode"
import { VideoNode } from "../nodes/VideoNode"
import "../styles/lexical-editor.css"
import { ExtendedTextNode } from "../nodes/ExtendedTextNode"

export interface LexiTexProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name: string,
  height?: string | null | undefined;
  maxWidth?: string | null | undefined;
  onImageUpload?: (file: File) => Promise<string>;
  showWordCount?: boolean;
  showCharCount?: boolean;
  theme?: 'light' | 'dark' | 'system';
  toolbarStyle?: 'normal' | 'scrollbar';
}

const editorTheme: EditorThemeClasses = {
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
}

export const LexicalTextEditor: React.FC<LexiTexProps> = React.memo(
  function LexicalTextEditor({
    name,
    value,
    onChange,
    placeholder,
    maxWidth = null,
    height = null,
    onImageUpload,
    showWordCount = true,
    showCharCount = true,
    theme = 'light',
    toolbarStyle = 'normal',
  }) {
    const [sourceView, setSourceView] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const sourceViewApplyRef = useRef<(() => void) | null>(null);
    const [systemDark, setSystemDark] = useState(false);

    // `system` follows the OS color-scheme preference. matchMedia is only
    // touched inside effects so the component stays SSR/render-safe.
    useEffect(() => {
      if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemDark(mediaQuery.matches);
      const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', onChange);
        return () => mediaQuery.removeEventListener('change', onChange);
      }
      // Legacy Safari fallback
      mediaQuery.addListener(onChange);
      return () => mediaQuery.removeListener(onChange);
    }, [theme]);

    const isDark = theme === 'dark' || (theme === 'system' && systemDark);

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
      if (!fullscreen) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setFullscreen(false);
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [fullscreen]);

    const initialConfig = useMemo(
      () => ({
        namespace: name,
        theme: editorTheme,
        onError: (error: Error) => {
          console.error("Lexical error:", error);
        },
        nodes: [
          ExtendedTextNode,
          {
            replace: TextNode,
            with: (node: TextNode) => new ExtendedTextNode(node.__text),
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
      }) as any,
      [name]
    );

    return (
      <div
        className={`lexical-text-editor lexical-editor-container ${fullscreen ? "lexical-fullscreen" : ""} ${isDark ? "lexical-dark" : ""}`}
        style={{
          maxWidth: fullscreen ? 'none' : (maxWidth ? maxWidth : '1090px'),
        }}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <div className="lexical-toolbar-container">
            <ToolbarPlugin
              value={value}
              onImageUpload={onImageUpload}
              sourceView={sourceView}
              onToggleSourceView={toggleSourceView}
              fullscreen={fullscreen}
              onToggleFullscreen={toggleFullscreen}
              toolbarStyle={toolbarStyle}
            />
          </div>
          <div
            className="lexical-editor-inner"
            style={sourceView ? { display: 'none' } : undefined}
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="lexical-content-editable" style={{
                  height: height ? height : '500px',
                }} />
              }
              placeholder={
                <div className="lexical-placeholder">
                  {placeholder || "Some Text"}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          {sourceView &&
            <SourceView
              applyRef={sourceViewApplyRef}
              onExit={() => setSourceView(false)}
            />}
          {(showWordCount || showCharCount) &&
            <StatusBar
              showWordCount={showWordCount}
              showCharCount={showCharCount}
            />}
          <HistoryPlugin />
          <ListPlugin />
          <LexicalTablePlugin />
          <HorizontalRulePlugin />
          <LinkPlugin />
          <CustomOnChangePlugin value={value} onChange={onChange} />
        </LexicalComposer>
      </div>
    )
  }
)