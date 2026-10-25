import { LexicalComposer } from "@lexical/react/LexicalComposer"
import React, { useMemo } from "react"
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
}

const theme: EditorThemeClasses = {
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
  function LexicalTextEditor({ name, value, onChange, placeholder, maxWidth = null, height = null, onImageUpload }) {

    const initialConfig = useMemo(
      () => ({
        namespace: name,
        theme: theme,
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
      <div className="lexical-text-editor lexical-editor-container"
        style={{
          maxWidth: maxWidth ? maxWidth : '1090px',
        }}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <div className="lexical-toolbar-container">
            <ToolbarPlugin value={value} onImageUpload={onImageUpload} />
          </div>
          <div className="lexical-editor-inner">
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