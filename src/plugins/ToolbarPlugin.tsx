

import { HeadingAction, LOW_PRIORIRTY, RICH_BLOCK_OPTIONS, RICH_REDO_UNDO_OPTIONS, RICH_TEXT_OPTIONS, RichTextAction } from "../constants/index"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $createParagraphNode, $getSelection, $isElementNode, $isRangeSelection, $isTextNode, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from "lexical"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { type HeadingTagType, $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $wrapNodes } from '@lexical/selection'
import { $createQuoteNode, $isQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  TOGGLE_LINK_COMMAND,
  $isLinkNode,
} from "@lexical/link";

import {
  INSERT_HORIZONTAL_RULE_COMMAND,
} from "@lexical/react/LexicalHorizontalRuleNode";

import { $isListNode, ListNode } from '@lexical/list'
import { DropdownList } from "../components/DropdownList"
import Separator from "../components/Separator"
import { HeadingSelectionList } from "../components/HeadingSelectionList"
import { IoIosLink } from "react-icons/io"
import { IoCodeOutline, IoSearchOutline } from "react-icons/io5"
import { BsFullscreen, BsFullscreenExit, BsThreeDots } from "react-icons/bs"
import LinkModal from "../components/LinkModal"
import FindReplaceModal from "../components/FindReplaceModal"
import ToolbarOverflowModal from "../components/ToolbarOverflowModal"
import { AlignmentSelectionList } from "../components/AlignmentSelectionList"
import ColorPlugin from "./ColorPlugin"
import FontFamilyPlugin from "./FontFamilyPlugin"
import FontSizePlugin from "./FontSizePlugin"
import CodeBlockPlugin from "./CodeBlockPlugin"
import ListPlugin from "./ListPlugin"
import TablePlugin from "./TablePlugin"
import ImagePlugin from "./ImagePlugin"
import VideoPlugin from "./VideoPlugin"
import ContentPreviewDialog from "../components/ContentPreview"
import TooltipX from "../components/common/Tooltip"

/**
 * Toolbar segment layout (3.3): items marked `primary` always stay inline
 * (undo/redo, heading, text formats, alignment, link); the rest collapse into
 * the overflow modal from the END of this list towards the front when the
 * toolbar runs out of width.
 */
const SEGMENTS: { id: string; primary?: boolean }[] = [
  { id: 'lists' },
  { id: 'blockOptions' },
  { id: 'fontFamily' },
  { id: 'fontSize' },
  { id: 'color' },
  { id: 'codeBlock' },
  { id: 'dropdown' },
  { id: 'alignment', primary: true },
  { id: 'link', primary: true },
  { id: 'image' },
  { id: 'video' },
  { id: 'table' },
  { id: 'utility' },
  { id: 'preview' },
];
const NON_PRIMARY_IDS = SEGMENTS.filter((s) => !s.primary).map((s) => s.id);
const SEGMENT_GAP = 6;
const ELLIPSIS_FALLBACK_WIDTH = 40;

export const ToolbarPlugin = ({
  value,
  onImageUpload,
  sourceView = false,
  onToggleSourceView,
  fullscreen = false,
  onToggleFullscreen,
  toolbarStyle = 'normal',
}: {
  value: string;
  onImageUpload?: (file: File) => Promise<string>;
  sourceView?: boolean;
  onToggleSourceView?: () => void;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  toolbarStyle?: 'normal' | 'scrollbar';
}) => {

  const [editor] = useLexicalComposerContext();
  const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
    [RichTextAction.Undo]: true,
    [RichTextAction.Redo]: true
  })
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [collapsedCount, setCollapsedCount] = useState(0);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const primaryRef = useRef<HTMLDivElement | null>(null);
  const ellipsisRef = useRef<HTMLButtonElement | null>(null);
  const segmentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const widthCache = useRef<Record<string, number>>({});
  const ellipsisWidthRef = useRef(0);
  const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>({
    [RichTextAction.LeftAlign]: true,
  })
  const [headingSelectionMap, setHeadingSelectionMap] = useState<{ [id: string]: boolean }>({
    [HeadingAction.Normal]: true,
  })
  const [blockType, setBlockType] = useState('paragraph');
  const [linkUrl, setLinkUrl] = useState("https://");
  let initialLoad = true



  const updateToolbar = () => {



    if (initialLoad) {
      const root = editor.getRootElement();
      if (root) {
        root.scrollTop = 0;
        initialLoad = false
      }
    }


    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [RichTextAction.Bold]: selection.hasFormat("bold"),
        [RichTextAction.Italics]: selection.hasFormat("italic"),
        [RichTextAction.Underline]: selection.hasFormat("underline"),
        [RichTextAction.Uppercase]: selection.hasFormat("uppercase"),
        [RichTextAction.Lowercase]: selection.hasFormat("lowercase"),
        [RichTextAction.Capitalize]: selection.hasFormat("capitalize"),
        [RichTextAction.Strikethrough]: selection.hasFormat("strikethrough"),
        [RichTextAction.Superscript]: selection.hasFormat("superscript"),
        [RichTextAction.Subscript]: selection.hasFormat("subscript"),
        [RichTextAction.Code]: selection.hasFormat("code"),
        [RichTextAction.Highlight]: selection.hasFormat("highlight"),
      }

      setSelectionMap(newSelectionMap);

      // headings------------------

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDom = editor.getElementByKey(elementKey);

      if (!elementDom) return;
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode)
        const type = parentList ? parentList.getTag() : element.getTag();
        setBlockType(type)
      }
      else if (element.getType() === "paragraph" || $isHeadingNode(element)) {
        let tag: string | null = null;
        if ($isHeadingNode(element)) {
          tag = element.getTag();
        }
        const newHeadingSelectionMap = {
          [HeadingAction.H1]: tag === "h1",
          [HeadingAction.H2]: tag === "h2",
          [HeadingAction.H3]: tag === "h3",
          [HeadingAction.H4]: tag === "h4",
          [HeadingAction.H5]: tag === "h5",
          [HeadingAction.H6]: tag === "h6",
          [HeadingAction.Normal]: element.getType() === "paragraph",
        };
        setBlockType(element.getType())
        setHeadingSelectionMap(newHeadingSelectionMap);
      }
      else {
        setBlockType(element.getType());
      }

      // ----------------------- alignments

      const target = $isElementNode(anchorNode) ? anchorNode : element;

      const alignment = target.getFormat();
      // returns: 'left' = 1 | 'right' = 3 | 'center' = 2 | 'justify' = 4 | '' = 0 (default)
      setSelectionMap((prev) => ({
        ...prev,
        [RichTextAction.LeftAlign]: alignment === 0 || alignment === 1,
        [RichTextAction.CenterAlign]: alignment === 2,
        [RichTextAction.RightAlign]: alignment === 3,
        [RichTextAction.JustifyAlign]: alignment === 4,
      }));

      // ----------------------- quotes

      if (element.getType() === "quote") {
        setSelectionMap((prev) => ({
          ...prev,
          [RichTextAction.Quote]: true,
        }));
      }
      else {
        setSelectionMap((prev) => ({
          ...prev,
          [RichTextAction.Quote]: false,
        }));
      }

      // Update links
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setSelectionMap((prev) => ({
          ...prev,
          [RichTextAction.Link]: true,
        }));

        setLinkUrl(parent.getURL());
        setLinkModalOpen(true);
      } else if ($isLinkNode(node)) {
        setSelectionMap((prev) => ({
          ...prev,
          [RichTextAction.Link]: true,
        }));
        setLinkUrl(node.getURL());
        setLinkModalOpen(true);
      } else {
        setSelectionMap((prev) => ({
          ...prev,
          [RichTextAction.Link]: false,
        }));
        setLinkUrl("https://")
        setLinkModalOpen(false);
      }

    }
  }



  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setDisableMap(prevDisableMap => ({
            ...prevDisableMap, undo: !payload
          }))
          return false;
        },
        LOW_PRIORIRTY

      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setDisableMap(prevDisableMap => ({
            ...prevDisableMap, redo: !payload
          }))
          return false;
        },
        LOW_PRIORIRTY
      )
    )
  }, [])

  // ---------------- Overflow (3.3) + toolbar style (3.2) ----------------

  const isScrollbarMode = toolbarStyle === 'scrollbar';

  /**
   * Predictive fit: measures the primary row and every segment (hidden
   * segments from a width cache), then collapses non-primary segments from
   * the end until the toolbar fits. State is only written on change, so the
   * measure -> render -> measure cycle always terminates.
   */
  const syncOverflow = useCallback(() => {
    if (toolbarStyle !== 'normal') return;
    const row = rowRef.current;
    if (!row) return;
    // The row has no padding/border, so clientWidth is the usable width
    const available = row.clientWidth;
    if (available <= 0) return;

    const primaryWidth = primaryRef.current ? primaryRef.current.offsetWidth : 0;
    const widths = NON_PRIMARY_IDS.map((id) => {
      const el = segmentRefs.current[id];
      if (el && el.style.display !== 'none') {
        widthCache.current[id] = el.offsetWidth;
      }
      return widthCache.current[id] ?? 0;
    });
    if (ellipsisRef.current) {
      ellipsisWidthRef.current = ellipsisRef.current.offsetWidth;
    }
    const ellipsisWidth = ellipsisWidthRef.current || ELLIPSIS_FALLBACK_WIDTH;

    const computeTotal = (k: number) => {
      const visibleCount = 1 + (k > 0 ? 1 : 0) + (NON_PRIMARY_IDS.length - k);
      let total =
        primaryWidth +
        Math.max(0, visibleCount - 1) * SEGMENT_GAP +
        (k > 0 ? ellipsisWidth : 0);
      for (let i = 0; i < NON_PRIMARY_IDS.length - k; i++) {
        total += widths[i];
      }
      return total;
    };

    let k = collapsedCount;
    while (k < NON_PRIMARY_IDS.length && computeTotal(k) > available) k++;
    while (k > 0 && computeTotal(k - 1) <= available) k--;
    setCollapsedCount((prev) => (prev === k ? prev : k));
  }, [toolbarStyle, collapsedCount]);

  // Re-measure after every render (selection changes resize dropdown labels)
  useEffect(() => {
    syncOverflow();
  });
  const syncOverflowRef = useRef<() => void>(() => { });
  syncOverflowRef.current = syncOverflow;

  // Row width changes
  useEffect(() => {
    if (toolbarStyle !== 'normal' || typeof ResizeObserver === 'undefined') return;
    const row = rowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(() => syncOverflowRef.current());
    observer.observe(row);
    return () => observer.disconnect();
  }, [toolbarStyle]);

  useEffect(() => {
    if (collapsedCount === 0) setOverflowOpen(false);
  }, [collapsedCount]);

  useEffect(() => {
    if (toolbarStyle === 'scrollbar') setCollapsedCount(0);
  }, [toolbarStyle]);

  const onAction = (id: RichTextAction) => {
    switch (id) {
      case RichTextAction.Bold: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        break;
      }
      case RichTextAction.Italics: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        break;
      }
      case RichTextAction.Underline: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        break;
      }
      case RichTextAction.Lowercase: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "lowercase")
        break;
      }
      case RichTextAction.Uppercase: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "uppercase")
        break;
      }
      case RichTextAction.Capitalize: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "capitalize")
        break;
      }
      case RichTextAction.Strikethrough: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        break;
      }
      case RichTextAction.Superscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
        break;
      }
      case RichTextAction.Subscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")
        break;
      }
      case RichTextAction.Highlight: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight")
        break;
      }
      case RichTextAction.Code: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
        break;
      }
      case RichTextAction.Quote: {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const parent = anchorNode.getParent();

            if (parent && $isQuoteNode(parent)) {
              $setBlocksType(selection, () => $createParagraphNode());
            } else {
              $wrapNodes(selection, () => $createQuoteNode());
            }
          }
        });
        break;
      }
      case RichTextAction.Link: {
        insertLink();
        setLinkModalOpen(true);
        break;
      }
      case RichTextAction.LeftAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
        break;
      }
      case RichTextAction.RightAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
        break;
      }
      case RichTextAction.CenterAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
        break;
      }
      case RichTextAction.JustifyAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
        break;
      }
      case RichTextAction.Undo: {
        editor.dispatchCommand(UNDO_COMMAND, undefined)
        break;
      }
      case RichTextAction.Redo: {
        editor.dispatchCommand(REDO_COMMAND, undefined)
        break;
      }
      case RichTextAction.ClearFormatting: {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const textNodes = selection.getNodes().filter($isTextNode);
          for (const node of textNodes) {
            node.setFormat(0);
            node.setStyle("");
          }
        });
        break;
      }
      case RichTextAction.HorizontalRule: {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
        break;
      }
      case RichTextAction.Indent: {
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
        break;
      }
      case RichTextAction.Outdent: {
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
        break;
      }
    }
  }

  // useKeyBindings({ onAction });

  // const getSelectedBtnProps = (
  //   isSelected: boolean
  // ): Partial<IconButtonProps> =>
  //   isSelected
  //     ? {
  //       colorScheme: "blue",
  //       variant: "solid",
  //     }
  //     : {};
  // const ref = useRef<HTMLSelectElement | null>(null)

  const updateHeading = (heading: HeadingTagType | 'normal') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (heading === "normal") {
          $wrapNodes(selection, () => $createParagraphNode());
        } else {
          $wrapNodes(selection, () => $createHeadingNode(heading));
        }
      }
    });
  };

  // const insertLink = useCallback(() => {
  //   console.log('insertlink');
  //   const selection = $getSelection();
  //   if (!$isRangeSelection(selection) || selection.isCollapsed()) {
  //     // Nothing selected → do nothing
  //     return;
  //   }

  //   if (!linkModalOpen) {
  //     if (linkUrl !== "") {
  //       editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
  //     }
  //   } else {
  //     editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  //   }
  // }, [editor, linkModalOpen]);

  const insertLink = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        // Nothing selected → do nothing
        return;
      }

      if (!linkModalOpen) {
        if (linkUrl !== "") {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
        }
      } else {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      }
    });
  }, [editor, linkModalOpen, linkUrl]);


  const removeLink = useCallback(() => {
    setLinkUrl("")
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setLinkModalOpen(false)
  }, [editor])


  //      <div className="flex gap-1.5 justify-start items-center p-1.5 pb-2 mb-1 border-b-[1px] overflow-x-auto overflow-y-hidden scrollbar-thin">

  const isSegmentHidden = (id: string) => {
    const pos = NON_PRIMARY_IDS.indexOf(id);
    return pos >= NON_PRIMARY_IDS.length - collapsedCount;
  };

  const segmentNodes: Record<string, ReactNode> = {
    lists: (<><ListPlugin blockType={blockType} /><Separator /></>),
    blockOptions: (
      <>
        {
          RICH_BLOCK_OPTIONS.map(({ id, label, icon }) => (
            id === RichTextAction.Divider ? <Separator key={id} /> :
              <TooltipX key={id} content={label} direction="bottom">
                <button type="button"
                  className={`size-8 lexical-btn ${selectionMap[id] ? "toolbarActive" : "toolbar"
                    } icon`}
                  onClick={() => onAction(id)}
                >
                  {icon}
                </button>
              </TooltipX>
          ))
        }
      </>
    ),
    fontFamily: <FontFamilyPlugin />,
    fontSize: <FontSizePlugin />,
    color: <ColorPlugin />,
    codeBlock: <CodeBlockPlugin />,
    dropdown: <DropdownList onAction={onAction} selectionMap={selectionMap} />,
    image: <ImagePlugin onImageUpload={onImageUpload} />,
    video: <VideoPlugin />,
    table: <TablePlugin />,
    utility: (
      <>
        <Separator />
        <TooltipX content="Find & Replace" direction="bottom">
          <button type="button"
            aria-label="Find & Replace"
            className={`size-8 lexical-btn ${findReplaceOpen ? "toolbarActive" : "toolbar"
              } icon`}
            onClick={() => setFindReplaceOpen((prev) => !prev)}
          >
            <IoSearchOutline />
          </button>
        </TooltipX>
        <TooltipX content="Source Code View" direction="bottom">
          <button type="button"
            aria-label="Source Code View"
            className={`size-8 lexical-btn ${sourceView ? "toolbarActive" : "toolbar"
              } icon`}
            onClick={() => onToggleSourceView?.()}
          >
            <IoCodeOutline />
          </button>
        </TooltipX>
        <TooltipX content={fullscreen ? "Exit Fullscreen" : "Fullscreen"} direction="bottom">
          <button type="button"
            aria-label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className={`size-8 lexical-btn ${fullscreen ? "toolbarActive" : "toolbar"
              } icon`}
            onClick={() => onToggleFullscreen?.()}
          >
            {fullscreen ? <BsFullscreenExit /> : <BsFullscreen />}
          </button>
        </TooltipX>
      </>
    ),
    preview: <ContentPreviewDialog value={value} />,
  };

  return (
    <div
      className="lexical-toolbar-wrapper"
      style={{
        position: 'relative',
        padding: 12, marginBottom: 4, borderBottom: '1px solid #e5e7eb'
      }}
    >
      <div
        ref={rowRef}
        className={`lte-toolbar-row ${isScrollbarMode ? "useScroll scrollbar-thin" : "lte-nowrap"}`}
      >
        <div ref={primaryRef} className="lte-toolbar-primary" style={{ display: 'flex', gap: 6, justifyContent: 'start', alignItems: 'center' }}>
        {
          RICH_REDO_UNDO_OPTIONS.map(({ id, label, icon }) => (
            id === RichTextAction.Divider ? <Separator key={id} /> :
              <TooltipX content={label} direction="bottom" key={label}>
                <button type="button"
                  className={`size-8 lexical-btn ${selectionMap[id] ? "toolbarActive" : "toolbar"
                    } icon`}
                  onClick={() => onAction(id)}
                  disabled={!!disableMap[id]}
                >
                  {icon}
                </button>
              </TooltipX>
          ))
        }
        <div style={{ display: 'flex', gap: 6, justifyContent: 'start', alignItems: 'center' }}>

          <HeadingSelectionList updateHeading={updateHeading} headingSelectionMap={headingSelectionMap} />
          <Separator />
        </div>
        {
          RICH_TEXT_OPTIONS.map(({ id, label, icon }) => (
            id === RichTextAction.Divider ? <Separator key={id} /> :
              <TooltipX key={id} content={label} direction="bottom">
                <button type="button"
                  className={`size-8 lexical-btn ${selectionMap[id] ? "toolbarActive" : "toolbar"
                    } icon`}
                  onClick={() => onAction(id)}
                >
                  {icon}
                </button>
              </TooltipX>


          ))
        }
        <div style={{ display: 'flex', gap: 6, justifyContent: 'start', alignItems: 'center' }}>
          <AlignmentSelectionList onAction={onAction} alignmentSelectionMap={selectionMap} />
          <Separator />
        </div>

        <TooltipX content="Link" direction="bottom">
          <button type="button"
            className={`size-8 lexical-btn ${selectionMap[RichTextAction.Link] ? "toolbarActive" : "toolbar"
              } icon`}
            onClick={() => onAction(RichTextAction.Link)}
            disabled={!!disableMap[RichTextAction.Link]}
          >
            {<IoIosLink />}
          </button>
        </TooltipX>
      </div>

      {SEGMENTS.filter(({ primary }) => !primary).map(({ id }) => {
        const hidden = isSegmentHidden(id);
        return (
          <div
            key={id}
            ref={(el) => { segmentRefs.current[id] = el; }}
            style={hidden
              ? { display: 'none' }
              : { display: 'flex', gap: 6, justifyContent: 'start', alignItems: 'center' }}
          >
            {hidden ? null : segmentNodes[id]}
          </div>
        );
      })}

      {collapsedCount > 0 &&
        <TooltipX content="More tools" direction="bottom">
          <button type="button"
            ref={ellipsisRef}
            aria-label="More tools"
            className={`size-8 lexical-btn ${overflowOpen ? "toolbarActive" : "toolbar"
              } icon`}
            onClick={() => setOverflowOpen((prev) => !prev)}
          >
            <BsThreeDots />
          </button>
        </TooltipX>}
      </div>

      {linkModalOpen &&
        <LinkModal
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          removeLink={removeLink}
          onConfirm={(url) => {
            // Dispatch TOGGLE_LINK_COMMAND with the URL directly
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
              url: url,
              target: "_blank",
            });


            // Update state for modal and UI
            setLinkUrl(url);
            setLinkModalOpen(false);
          }}

          onCancel={() => {
            setLinkUrl("")
            // editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
            setLinkModalOpen(false)
          }}
        />}

      {overflowOpen &&
        <ToolbarOverflowModal anchorRef={ellipsisRef} onClose={() => setOverflowOpen(false)}>
          {NON_PRIMARY_IDS
            .filter((id) => isSegmentHidden(id))
            .map((id) => (
              <div key={id} className="lte-overflow-item">{segmentNodes[id]}</div>
            ))}
        </ToolbarOverflowModal>}

      {findReplaceOpen &&
        <FindReplaceModal
          onClose={() => setFindReplaceOpen(false)}
        />}


      {/* <YoutubePlugin /> */}
    </div>
  )
}


