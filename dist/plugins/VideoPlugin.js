import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { $createVideoNode } from "../nodes/VideoNode";
import RawDialog from "../components/common/Dialog";
export default function VideoPlugin() {
    const [isOpen, setIsOpen] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [url, setURL] = useState("");
    const [editor] = useLexicalComposerContext();
    const onEmbed = () => {
        if (!url)
            return;
        let provider = null;
        let id = null;
        // youtube
        const ytMatch = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);
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
    return (_jsxs("div", { className: "lexical-text-editor-dialog", children: [_jsx("button", { type: "button", className: `size-8 lexical-btn ${isOpen ? "toolbarActive" : "toolbar"} icon`, onClick: () => setIsOpen(true), children: _jsx(FaYoutube, { size: 18, color: "red" }) }), _jsxs(RawDialog, { open: isOpen, onClose: () => setIsOpen(false), children: [_jsx("div", { className: "lte-dialog-header", children: "Embed Video" }), _jsxs("div", { className: "lte-dialog-body", children: [_jsx("input", { className: "lte-input", placeholder: "Add YouTube or Google Drive URL", value: url, onChange: (e) => setURL(e.target.value) }), showMessage && (_jsx("p", { className: "lte-error-text", children: "It's not a valid YouTube or Google Drive URL" }))] }), _jsx("div", { className: "lte-dialog-footer", children: _jsx("button", { type: "button", className: "lte-primary-btn", disabled: !url, onClick: onEmbed, children: "Embed" }) })] })] }));
}
