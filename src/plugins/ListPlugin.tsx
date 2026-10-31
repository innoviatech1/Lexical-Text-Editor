
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { BsListOl, BsListUl } from "react-icons/bs";
import TooltipX from "../components/common/Tooltip";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  INDENT_CONTENT_COMMAND,
  KEY_TAB_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { ListNode } from "@lexical/list";
import { useEffect } from "react";

interface ListPluginProps {
  blockType: string;
}

export default function ListPlugin({ blockType }: ListPluginProps) {
  const [editor] = useLexicalComposerContext();

  // Tab / Shift+Tab inside lists -> indent / outdent (nested lists)
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (event: KeyboardEvent) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;

          const anchorNode = selection.anchor.getNode();
          const list = $getNearestNodeOfType(anchorNode, ListNode);
          if (!list) return false;

          event.preventDefault();
          editor.dispatchCommand(
            event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND,
            undefined
          );
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  const handleOrderedList = () => {
    if (blockType === "ol") {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const handleUnorderedList = () => {
    if (blockType === "ul") {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <>
      <TooltipX content="Ordered list" direction="bottom">
        <button type="button"
          className={`size-10 lexical-btn ${blockType === "ol" ? "toolbarActive" : "toolbar"
            } icon`}
          onClick={handleOrderedList}
        >
          <BsListOl />
        </button>
      </TooltipX>

      <TooltipX content="Unordered list" direction="bottom">
        <button type="button"
          className={`size-10 lexical-btn ${blockType === "ul" ? "toolbarActive" : "toolbar"
            } icon`}
          onClick={handleUnorderedList}
        >
          <BsListUl />
        </button>
      </TooltipX>

    </>
  );
}
