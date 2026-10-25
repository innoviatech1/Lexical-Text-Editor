
import { RxLetterCaseLowercase, RxLetterCaseCapitalize, RxLetterCaseUppercase } from "react-icons/rx";
import { TbBold, TbItalic, TbUnderline } from "react-icons/tb";
import { BsArrowClockwise, BsArrowCounterclockwise, BsChatSquareQuote, BsJustify, BsJustifyLeft, BsJustifyRight, BsSubscript, BsSuperscript, BsTextCenter, BsTextParagraph, BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6 } from "react-icons/bs";
import { AiOutlineStrikethrough } from "react-icons/ai";
import { IoCodeSlashOutline } from "react-icons/io5";
import { PiHighlighterLight } from "react-icons/pi";
import { RiEraserLine } from "react-icons/ri";
import { RiIndentDecrease, RiIndentIncrease } from "react-icons/ri";
import { TbSeparatorHorizontal } from "react-icons/tb";
import { BsTable } from "react-icons/bs";

export enum RichTextAction {
  Bold = "bold",
  Italics = "italics",
  Underline = "underline",
  Quote = 'quote',
  Lowercase = "lowercase",
  Uppercase = "uppercase",
  Capitalize = "capitalize",
  Strikethrough = "strikethrough",
  Superscript = "superscript",
  Subscript = "subscript",
  Highlight = "highlight",
  Code = "code",
  Link = 'link',
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
}

export enum HeadingAction {
  Normal = 'normal',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export const RICH_TEXT_FORMAT_OPTIONS = [
  {
    id: RichTextAction.Lowercase,
    icon: <RxLetterCaseLowercase />,
    label: "Lowercase",
  },
  {
    id: RichTextAction.Uppercase,
    icon: <RxLetterCaseUppercase />,
    label: "Uppercase",
  },
  {
    id: RichTextAction.Capitalize,
    icon: <RxLetterCaseCapitalize />,
    label: "Capitalize",
  },
  {
    id: RichTextAction.Strikethrough,
    icon: <AiOutlineStrikethrough />,
    label: "Strikethrough",
  },
  {
    id: RichTextAction.Highlight,
    icon: <PiHighlighterLight />,
    label: "Highlight",
    fontSize: 10,
  },
  {
    id: RichTextAction.Superscript,
    icon: <BsSuperscript />,
    label: "Superscript",
  },
  {
    id: RichTextAction.Subscript,
    icon: <BsSubscript />,
    label: "Subscript",
  },

];

export const RICH_TEXT_OPTIONS = [
  { id: RichTextAction.Bold, icon: <TbBold />, label: "Bold" },
  { id: RichTextAction.Italics, icon: <TbItalic />, label: "Italics" },
  { id: RichTextAction.Underline, icon: <TbUnderline />, label: "Underline" },
  { id: RichTextAction.Divider },
  { id: RichTextAction.Quote, icon: <BsChatSquareQuote />, label: "Quote" },
  // { id: RichTextAction.Divider },

  {
    id: RichTextAction.Code,
    icon: <IoCodeSlashOutline />,
    label: "Code",
  },
  // { id: RichTextAction.Link, label: "Link", icon: <IoIosLink /> },
  {
    id: RichTextAction.ClearFormatting,
    icon: <RiEraserLine />,
    label: "Clear Formatting",
  },
];

export const RICH_REDO_UNDO_OPTIONS = [
  {
    id: RichTextAction.Undo,
    icon: <BsArrowCounterclockwise />,
    label: "Undo",
  },
  {
    id: RichTextAction.Redo,
    icon: <BsArrowClockwise />,
    label: "Redo",
  },
  { id: RichTextAction.Divider },
]

export const RICH_ALIGNMENT_OPTIONS = [

  {
    id: RichTextAction.LeftAlign,
    icon: <BsJustifyLeft />,
    label: "Left Align",
  },
  {
    id: RichTextAction.CenterAlign,
    icon: <BsTextCenter />,
    label: "Center Align",
  },
  {
    id: RichTextAction.RightAlign,
    icon: <BsJustifyRight />,
    label: "Right Align",
  },
  {
    id: RichTextAction.JustifyAlign,
    icon: <BsJustify />,
    label: "Justify Align",
  },
];

export const RICH_BLOCK_OPTIONS = [
  {
    id: RichTextAction.Indent,
    icon: <RiIndentIncrease />,
    label: "Indent",
  },
  {
    id: RichTextAction.Outdent,
    icon: <RiIndentDecrease />,
    label: "Outdent",
  },
  { id: RichTextAction.Divider },
  {
    id: RichTextAction.HorizontalRule,
    icon: <TbSeparatorHorizontal />,
    label: "Horizontal Rule",
  },
];

export const LOW_PRIORIRTY = 1;
export const HEADINGS = [
  {
    id: "normal",
    label: "Normal",
    icon: <BsTextParagraph />
  },
  {
    id: "h1",
    label: "Heading 1",
    icon: <BsTypeH1 />
  },
  {
    id: "h2",
    label: "Heading 2",
    icon: <BsTypeH2 />
  },
  {
    id: "h3",
    label: "Heading 3",
    icon: <BsTypeH3 />
  },
  {
    id: "h4",
    label: "Heading 4",
    icon: <BsTypeH4 />
  },
  {
    id: "h5",
    label: "Heading 5",
    icon: <BsTypeH5 />
  },
  {
    id: "h6",
    label: "Heading 6",
    icon: <BsTypeH6 />
  },

]

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