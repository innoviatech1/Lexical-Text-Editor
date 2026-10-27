import { jsx as _jsx } from "react/jsx-runtime";
import { RxLetterCaseLowercase, RxLetterCaseCapitalize, RxLetterCaseUppercase } from "react-icons/rx";
import { TbBold, TbItalic, TbUnderline } from "react-icons/tb";
import { BsArrowClockwise, BsArrowCounterclockwise, BsChatSquareQuote, BsJustify, BsJustifyLeft, BsJustifyRight, BsSubscript, BsSuperscript, BsTextCenter, BsTextParagraph, BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6 } from "react-icons/bs";
import { AiOutlineStrikethrough } from "react-icons/ai";
import { IoCodeSlashOutline } from "react-icons/io5";
import { PiHighlighterLight } from "react-icons/pi";
import { RiEraserLine } from "react-icons/ri";
import { RiIndentDecrease, RiIndentIncrease } from "react-icons/ri";
import { TbSeparatorHorizontal } from "react-icons/tb";
export var RichTextAction;
(function (RichTextAction) {
    RichTextAction["Bold"] = "bold";
    RichTextAction["Italics"] = "italics";
    RichTextAction["Underline"] = "underline";
    RichTextAction["Quote"] = "quote";
    RichTextAction["Lowercase"] = "lowercase";
    RichTextAction["Uppercase"] = "uppercase";
    RichTextAction["Capitalize"] = "capitalize";
    RichTextAction["Strikethrough"] = "strikethrough";
    RichTextAction["Superscript"] = "superscript";
    RichTextAction["Subscript"] = "subscript";
    RichTextAction["Highlight"] = "highlight";
    RichTextAction["Code"] = "code";
    RichTextAction["Link"] = "link";
    RichTextAction["LeftAlign"] = "leftAlign";
    RichTextAction["CenterAlign"] = "centerAlign";
    RichTextAction["RightAlign"] = "rightAlign";
    RichTextAction["JustifyAlign"] = "justifyAlign";
    RichTextAction["Divider"] = "divider";
    RichTextAction["Undo"] = "undo";
    RichTextAction["Redo"] = "redo";
    RichTextAction["ClearFormatting"] = "clearFormatting";
    RichTextAction["CodeBlock"] = "codeBlock";
    RichTextAction["HorizontalRule"] = "horizontalRule";
    RichTextAction["Indent"] = "indent";
    RichTextAction["Outdent"] = "outdent";
    RichTextAction["Table"] = "table";
    RichTextAction["FindReplace"] = "findReplace";
    RichTextAction["SourceView"] = "sourceView";
    RichTextAction["Fullscreen"] = "fullscreen";
})(RichTextAction || (RichTextAction = {}));
export var HeadingAction;
(function (HeadingAction) {
    HeadingAction["Normal"] = "normal";
    HeadingAction["H1"] = "h1";
    HeadingAction["H2"] = "h2";
    HeadingAction["H3"] = "h3";
    HeadingAction["H4"] = "h4";
    HeadingAction["H5"] = "h5";
    HeadingAction["H6"] = "h6";
})(HeadingAction || (HeadingAction = {}));
export const RICH_TEXT_FORMAT_OPTIONS = [
    {
        id: RichTextAction.Lowercase,
        icon: _jsx(RxLetterCaseLowercase, {}),
        label: "Lowercase",
    },
    {
        id: RichTextAction.Uppercase,
        icon: _jsx(RxLetterCaseUppercase, {}),
        label: "Uppercase",
    },
    {
        id: RichTextAction.Capitalize,
        icon: _jsx(RxLetterCaseCapitalize, {}),
        label: "Capitalize",
    },
    {
        id: RichTextAction.Strikethrough,
        icon: _jsx(AiOutlineStrikethrough, {}),
        label: "Strikethrough",
    },
    {
        id: RichTextAction.Highlight,
        icon: _jsx(PiHighlighterLight, {}),
        label: "Highlight",
        fontSize: 10,
    },
    {
        id: RichTextAction.Superscript,
        icon: _jsx(BsSuperscript, {}),
        label: "Superscript",
    },
    {
        id: RichTextAction.Subscript,
        icon: _jsx(BsSubscript, {}),
        label: "Subscript",
    },
];
export const RICH_TEXT_OPTIONS = [
    { id: RichTextAction.Bold, icon: _jsx(TbBold, {}), label: "Bold" },
    { id: RichTextAction.Italics, icon: _jsx(TbItalic, {}), label: "Italics" },
    { id: RichTextAction.Underline, icon: _jsx(TbUnderline, {}), label: "Underline" },
    { id: RichTextAction.Divider },
    { id: RichTextAction.Quote, icon: _jsx(BsChatSquareQuote, {}), label: "Quote" },
    // { id: RichTextAction.Divider },
    {
        id: RichTextAction.Code,
        icon: _jsx(IoCodeSlashOutline, {}),
        label: "Code",
    },
    // { id: RichTextAction.Link, label: "Link", icon: <IoIosLink /> },
    {
        id: RichTextAction.ClearFormatting,
        icon: _jsx(RiEraserLine, {}),
        label: "Clear Formatting",
    },
];
export const RICH_REDO_UNDO_OPTIONS = [
    {
        id: RichTextAction.Undo,
        icon: _jsx(BsArrowCounterclockwise, {}),
        label: "Undo",
    },
    {
        id: RichTextAction.Redo,
        icon: _jsx(BsArrowClockwise, {}),
        label: "Redo",
    },
    { id: RichTextAction.Divider },
];
export const RICH_ALIGNMENT_OPTIONS = [
    {
        id: RichTextAction.LeftAlign,
        icon: _jsx(BsJustifyLeft, {}),
        label: "Left Align",
    },
    {
        id: RichTextAction.CenterAlign,
        icon: _jsx(BsTextCenter, {}),
        label: "Center Align",
    },
    {
        id: RichTextAction.RightAlign,
        icon: _jsx(BsJustifyRight, {}),
        label: "Right Align",
    },
    {
        id: RichTextAction.JustifyAlign,
        icon: _jsx(BsJustify, {}),
        label: "Justify Align",
    },
];
export const RICH_BLOCK_OPTIONS = [
    {
        id: RichTextAction.Indent,
        icon: _jsx(RiIndentIncrease, {}),
        label: "Indent",
    },
    {
        id: RichTextAction.Outdent,
        icon: _jsx(RiIndentDecrease, {}),
        label: "Outdent",
    },
    { id: RichTextAction.Divider },
    {
        id: RichTextAction.HorizontalRule,
        icon: _jsx(TbSeparatorHorizontal, {}),
        label: "Horizontal Rule",
    },
];
export const LOW_PRIORIRTY = 1;
export const HEADINGS = [
    {
        id: "normal",
        label: "Normal",
        icon: _jsx(BsTextParagraph, {})
    },
    {
        id: "h1",
        label: "Heading 1",
        icon: _jsx(BsTypeH1, {})
    },
    {
        id: "h2",
        label: "Heading 2",
        icon: _jsx(BsTypeH2, {})
    },
    {
        id: "h3",
        label: "Heading 3",
        icon: _jsx(BsTypeH3, {})
    },
    {
        id: "h4",
        label: "Heading 4",
        icon: _jsx(BsTypeH4, {})
    },
    {
        id: "h5",
        label: "Heading 5",
        icon: _jsx(BsTypeH5, {})
    },
    {
        id: "h6",
        label: "Heading 6",
        icon: _jsx(BsTypeH6, {})
    },
];
// ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"];
export const CODE_BLOCK_LANGUAGES = [
    { id: "plaintext", label: "Plain Text" },
    { id: "javascript", label: "JavaScript" },
    { id: "typescript", label: "TypeScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "csharp", label: "C#" },
    { id: "cpp", label: "C++" },
    { id: "php", label: "PHP" },
    { id: "ruby", label: "Ruby" },
    { id: "go", label: "Go" },
    { id: "rust", label: "Rust" },
    { id: "swift", label: "Swift" },
    { id: "kotlin", label: "Kotlin" },
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "sql", label: "SQL" },
    { id: "json", label: "JSON" },
    { id: "bash", label: "Bash" },
    { id: "markdown", label: "Markdown" },
    { id: "yaml", label: "YAML" },
    { id: "xml", label: "XML" },
];
