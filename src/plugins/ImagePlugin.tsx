import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_LOW, PASTE_COMMAND } from "lexical";
import { $createImageNode } from "../nodes/ImageNode";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import RawDialog from "../components/common/Dialog";
import TooltipX from "../components/common/Tooltip";
import { LuUpload } from "react-icons/lu";

type InsertImageParams = {
  src: string;
  altText?: string;
  caption?: string;
};

async function insertImage(editor: any, { src, altText = "", caption = "" }: InsertImageParams) {
  editor.update(() => {
    const node = $createImageNode({ src, altText, caption });
    $insertNodes([node]);
  });
}

export default function ImagePlugin({ onImageUpload }: { onImageUpload?: (file: File) => Promise<string> }) {
  const [editor] = useLexicalComposerContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [url, setURL] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = useCallback(async (file: File, alt: string = "", cap: string = "") => {
    let src: string;

    if (onImageUpload) {
      src = await onImageUpload(file);
    } else {
      src = URL.createObjectURL(file);
    }

    insertImage(editor, { src, altText: alt, caption: cap });
  }, [editor, onImageUpload]);

  const addImage = async () => {
    if (isUploading) return;

    if (file) {
      setIsUploading(true);
      try {
        await handleFileUpload(file, altText, caption);
      } catch (err) {
        console.error("Image upload failed:", err);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    } else if (url) {
      insertImage(editor, { src: url, altText, caption });
    } else {
      return;
    }

    setFile(undefined);
    setAltText("");
    setCaption("");
    setURL("");
    setIsOpen(false);
  };

  useEffect(() => {
    const unregister = editor.registerCommand(
      PASTE_COMMAND,
      (payload: ClipboardEvent | InputEvent) => {
        if (payload instanceof ClipboardEvent) {
          const items = payload.clipboardData?.items;
          if (!items) return false;

          for (const item of items) {
            if (item.type.startsWith("image/")) {
              payload.preventDefault();
              const blob = item.getAsFile();
              if (blob) {
                handleFileUpload(blob, "", "").catch(console.error);
              }
              return true;
            }
          }
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    return () => unregister();
  }, [editor, handleFileUpload]);

  return (
    <div className="lexical-text-editor-dialog">
      {/* hidden file input */}
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="lte-hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setFile(f);
          e.target.value = "";
        }}
      />

      {/* Open dialog button */}
      <TooltipX content="Add Image" direction="bottom">
        <button type="button"
          className={`size-10 lexical-btn ${isOpen ? "toolbarActive" : "toolbar"} icon`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <IoImageOutline size={18} />
        </button>
      </TooltipX>

      {/* Dialog */}
      <RawDialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="lte-dialog-header">Add Image</div>

        <div className="lte-dialog-body">
          <input
            className="lte-input"
            placeholder="Alt text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />

          <input
            className="lte-input"
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <input
            className="lte-input"
            placeholder="Add image by URL"
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />

          <div className="lte-divider">
            <span>or</span>
          </div>

          <button type="button"
            className={`lexical-btn heading-trigger toolbar-active`}
            onClick={() => inputRef.current?.click()}
            style={{
              width: 'fit-content',
              margin: '0 auto'
            }}
          >
            <LuUpload size={20} />
            <span>Upload Image</span>
          </button>

          {file && (
            <div className="lte-file-name">{file.name}</div>
          )}
        </div>

        <div className="lte-dialog-footer">
          <button type="button"
            className="lte-primary-btn"
            disabled={(!url && !file) || isUploading}
            onClick={addImage}
          >
            {isUploading ? "Uploading..." : "Add Image"}
          </button>
        </div>
      </RawDialog>
    </div>
  );
}