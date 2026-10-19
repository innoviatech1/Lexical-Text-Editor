

import { HeadingAction, LOW_PRIORIRTY, RICH_REDO_UNDO_OPTIONS, RICH_TEXT_OPTIONS, RichTextAction } from "../constants/index"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $createParagraphNode, $getSelection, $isElementNode, $isRangeSelection, $isTextNode, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from "lexical"
import { useCallback, useEffect, useState } from "react"
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { type HeadingTagType, $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $wrapNodes } from '@lexical/selection'
import { $createQuoteNode, $isQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  TOGGLE_LINK_COMMAND,
  $isLinkNode,
} from "@lexical/link";

import { $isListNode, ListNode } from '@lexical/list'
import { DropdownList } from "../components/DropdownList"
import Separator from "../components/Separator"
import { HeadingSelectionList } from "../components/HeadingSelectionList"
import { IoIosLink } from "react-icons/io"
import LinkModal from "../components/LinkModal"
import { AlignmentSelectionList } from "../components/AlignmentSelectionList"
import ColorPlugin from "./ColorPlugin"
import CodeBlockPlugin from "./CodeBlockPlugin"
import ListPlugin from "./ListPlugin"
import ImagePlugin from "./ImagePlugin"
import VideoPlugin from "./VideoPlugin"
import ContentPreviewDialog from "../components/ContentPreview"
import TooltipX from "../components/common/Tooltip"

export const ToolbarPlugin = ({ value, onImageUpload }: { value: string; onImageUpload?: (file: File) => Promise<string> }) => {

  const [editor] = useLexicalComposerContext();
  const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
    [RichTextAction.Undo]: true,
    [RichTextAction.Redo]: true
  })
  const [linkModalOpen, setLinkModalOpen] = useState(false);
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

  return (
    <div
      className="lexical-toolbar-wrapper"
      style={{
        position: 'relative',
        padding: 12, marginBottom: 4, borderBottom: '1px solid #e5e7eb'
      }}
    >
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

        <ListPlugin blockType={blockType} />

        <Separator />
      </div>

      <ColorPlugin />

      <CodeBlockPlugin />


      {/* alignment in dropdown */}


      <DropdownList onAction={onAction} selectionMap={selectionMap} />


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


      <ImagePlugin onImageUpload={onImageUpload} />

      <VideoPlugin />

      <ContentPreviewDialog value={value} />


      {/* <YoutubePlugin /> */}
    </div>
  )
}


