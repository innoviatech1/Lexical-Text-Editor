import { useEffect, useRef, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { BiUnlink } from "react-icons/bi";

interface LinkEditorProps {
  linkUrl: string;
  setLinkUrl: React.Dispatch<React.SetStateAction<string>>;
  onConfirm: (url: string) => void;
  onCancel: () => void;
  removeLink: () => void;
}

export default function LinkModal({
  linkUrl,
  setLinkUrl,
  onConfirm,
  onCancel,
  removeLink,
}: LinkEditorProps) {
  const [isEditMode, setEditMode] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (linkUrl === "https://") setEditMode(true);
  }, [linkUrl]);

  useEffect(() => {
    if (isEditMode) inputRef.current?.focus();
  }, [isEditMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  return (
    <div ref={editorRef} className="lexical-text-editor-link link-editor-container">
      <div className="link-editor-input-wrapper">
        {isEditMode ? (
          <input
            ref={inputRef}
            className="link-editor-input"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onConfirm(linkUrl);
                setEditMode(false);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setEditMode(false);
                onCancel();
              }
            }}
          />
        ) : (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-editor-url"
          >
            {linkUrl}
          </a>
        )}
      </div>

      <div className="link-editor-buttons">

        <button type="button"
          className={`lexical-btn heading-trigger toolbar`}
          onClick={() => {
            if (isEditMode) {
              onConfirm(linkUrl);
              setEditMode(false);
            } else setEditMode(true);
          }}
        >
          {isEditMode ? <MdCheck size={18} /> : <BsPencilSquare size={14} />}
        </button>

        <button type="button"
          className={`lexical-btn heading-trigger toolbar`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={removeLink}
        >
          <BiUnlink size={14} style={{ stroke: 'black' }} />
        </button>



        {/* <button type="button" 
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (isEditMode) {
              onConfirm(linkUrl);
              setEditMode(false);
            } else setEditMode(true);
          }}
          className={`size-10 toolbar icon`}
        >
          {isEditMode ? <MdCheck size={18} /> : <BsPencilSquare size={14} />}
        </button> */}

        {/* <button type="button" 
          onMouseDown={(e) => e.preventDefault()}
          onClick={removeLink}
          className={`size-10 toolbar icon`}
        >
          <BiUnlink size={14} style={{ stroke: 'black' }} />
        </button> */}
      </div>
    </div>
  );
}
