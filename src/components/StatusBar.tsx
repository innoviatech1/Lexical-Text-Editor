import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, type EditorState } from "lexical";
import { useEffect, useState, type ReactNode } from "react";

interface StatusBarProps {
  showWordCount?: boolean;
  showCharCount?: boolean;
  /** Optional right-aligned slot (e.g. display switchers) */
  rightSlot?: ReactNode;
}

/**
 * Live word / character count computed from the editor state text.
 * Decorator nodes (images, video embeds) contribute no text, matching
 * conventional word-count behavior.
 */
export default function StatusBar({ showWordCount = true, showCharCount = true, rightSlot }: StatusBarProps) {
  const [editor] = useLexicalComposerContext();
  const [counts, setCounts] = useState({ words: 0, chars: 0 });

  useEffect(() => {
    const compute = (editorState: EditorState) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        const trimmed = text.trim();
        setCounts({
          words: trimmed ? trimmed.split(/\s+/).length : 0,
          chars: text.length,
        });
      });
    };
    compute(editor.getEditorState());
    return editor.registerUpdateListener(({ editorState }) => {
      compute(editorState);
    });
  }, [editor]);

  return (
    <div className="lexical-status-bar">
      {showWordCount && <span>{counts.words} words</span>}
      {showCharCount && <span>{counts.chars} characters</span>}
      {rightSlot &&
        <div className="lexical-status-bar-right">{rightSlot}</div>}
    </div>
  );
}
