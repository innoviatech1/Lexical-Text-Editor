import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import { useEffect, useRef, useState } from "react";
import { MdCheck } from "react-icons/md";
import TooltipX from "./common/Tooltip";

interface SourceViewProps {
  /** Registered so the toolbar toggle can apply pending edits before exiting. */
  applyRef: React.MutableRefObject<(() => void) | null>;
  onExit: () => void;
}

/**
 * Raw HTML editing mode. The ContentEditable stays mounted (hidden) so the
 * editor state is preserved. Edited HTML is imported into the editor state
 * only on demand (Update / Done / toolbar toggle) — never per keystroke, so
 * undo history is not flooded and partially typed markup is not parsed.
 */
export default function SourceView({ applyRef, onExit }: SourceViewProps) {
  const [editor] = useLexicalComposerContext();
  const [html, setHtml] = useState(() =>
    editor.getEditorState().read(() => $generateHtmlFromNodes(editor))
  );
  const lastImportedRef = useRef(html);

  const importHtml = (value: string) => {
    if (value === lastImportedRef.current) return;
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

  return (
    <div className="lexical-source-view">
      <textarea
        className="lexical-source-textarea"
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        aria-label="HTML source"
        spellCheck={false}
      />
      <div className="lexical-source-actions">
        <TooltipX content="Apply HTML to the editor" direction="top">
          <button type="button"
            className="lexical-btn heading-trigger toolbar"
            onClick={() => importHtml(html)}
          >
            <MdCheck size={16} />
            <span className="label">Update</span>
          </button>
        </TooltipX>
        <button type="button"
          className="lexical-btn heading-trigger toolbar"
          onClick={() => {
            importHtml(html);
            onExit();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
