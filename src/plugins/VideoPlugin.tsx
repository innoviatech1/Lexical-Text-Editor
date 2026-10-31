import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { $createVideoNode } from "../nodes/VideoNode";
import RawDialog from "../components/common/Dialog";
import TooltipX from "../components/common/Tooltip";

export default function VideoPlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [url, setURL] = useState("");

  const [editor] = useLexicalComposerContext();

  const onEmbed = () => {
    if (!url) return;

    let provider: "youtube" | "drive" | null = null;
    let id: string | null = null;

    // youtube
    const ytMatch =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    if (ytMatch && ytMatch[2]?.length === 11) {
      provider = "youtube";
      id = ytMatch[2];
    }

    // drive
    const driveMatch = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//.exec(url);
    if (driveMatch && driveMatch[1]) {
      provider = "drive";
      id = driveMatch[1];
    }

    if (!id || !provider) {
      setShowMessage(true);
      return;
    }

    editor.update(() => {
      const node = $createVideoNode({ id, provider });
      $insertNodes([node]);
    });

    setURL("");
    setShowMessage(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setURL("");
      setShowMessage(false);
    }
  }, [isOpen]);

  return (
    <div className="lexical-text-editor-dialog">
      {/* Open dialog button */}
      <TooltipX content="Embed Video" direction="bottom">
        <button type="button"
          className={`size-10 lexical-btn ${isOpen ? "toolbarActive" : "toolbar"} icon`}
          onClick={() => setIsOpen(true)}
        >
          <FaYoutube size={18} color="red" />
        </button>
      </TooltipX>

      {/* Dialog */}
      <RawDialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="lte-dialog-header">Embed Video</div>

        <div className="lte-dialog-body">
          <input
            className="lte-input"
            placeholder="Add YouTube or Google Drive URL"
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />

          {showMessage && (
            <p className="lte-error-text">
              It's not a valid YouTube or Google Drive URL
            </p>
          )}
        </div>

        <div className="lte-dialog-footer">
          <button type="button"
            className="lte-primary-btn"
            disabled={!url}
            onClick={onEmbed}
          >
            Embed
          </button>
        </div>
      </RawDialog>
    </div>
  );
}
