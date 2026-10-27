import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_LOW, PASTE_COMMAND } from "lexical";
import { $createImageNode } from "../nodes/ImageNode";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import RawDialog from "../components/common/Dialog";
import { LuUpload } from "react-icons/lu";
async function insertImage(editor, { src, altText = "", caption = "" }) {
    editor.update(() => {
        const node = $createImageNode({ src, altText, caption });
        $insertNodes([node]);
    });
}
export default function ImagePlugin({ onImageUpload }) {
    const [editor] = useLexicalComposerContext();
    const inputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [url, setURL] = useState("");
    const [altText, setAltText] = useState("");
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState();
    const [isUploading, setIsUploading] = useState(false);
    const handleFileUpload = useCallback(async (file, alt = "", cap = "") => {
        let src;
        if (onImageUpload) {
            src = await onImageUpload(file);
        }
        else {
            src = URL.createObjectURL(file);
        }
        insertImage(editor, { src, altText: alt, caption: cap });
    }, [editor, onImageUpload]);
    const addImage = async () => {
        if (isUploading)
            return;
        if (file) {
            setIsUploading(true);
            try {
                await handleFileUpload(file, altText, caption);
            }
            catch (err) {
                console.error("Image upload failed:", err);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }
        else if (url) {
            insertImage(editor, { src: url, altText, caption });
        }
        else {
            return;
        }
        setFile(undefined);
        setAltText("");
        setCaption("");
        setURL("");
        setIsOpen(false);
    };
    useEffect(() => {
        const unregister = editor.registerCommand(PASTE_COMMAND, (payload) => {
            if (payload instanceof ClipboardEvent) {
                const items = payload.clipboardData?.items;
                if (!items)
                    return false;
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
        }, COMMAND_PRIORITY_LOW);
        return () => unregister();
    }, [editor, handleFileUpload]);
    return (_jsxs("div", { className: "lexical-text-editor-dialog", children: [_jsx("input", { type: "file", ref: inputRef, accept: "image/*", className: "lte-hidden", onChange: (e) => {
                    const f = e.target.files?.[0];
                    if (f)
                        setFile(f);
                    e.target.value = "";
                } }), _jsx("button", { type: "button", className: `size-8 lexical-btn ${isOpen ? "toolbarActive" : "toolbar"} icon`, onClick: () => setIsOpen((prev) => !prev), children: _jsx(IoImageOutline, { size: 18 }) }), _jsxs(RawDialog, { open: isOpen, onClose: () => setIsOpen(false), children: [_jsx("div", { className: "lte-dialog-header", children: "Add Image" }), _jsxs("div", { className: "lte-dialog-body", children: [_jsx("input", { className: "lte-input", placeholder: "Alt text", value: altText, onChange: (e) => setAltText(e.target.value) }), _jsx("input", { className: "lte-input", placeholder: "Caption", value: caption, onChange: (e) => setCaption(e.target.value) }), _jsx("input", { className: "lte-input", placeholder: "Add image by URL", value: url, onChange: (e) => setURL(e.target.value) }), _jsx("div", { className: "lte-divider", children: _jsx("span", { children: "or" }) }), _jsxs("button", { type: "button", className: `lexical-btn heading-trigger toolbar-active`, onClick: () => inputRef.current?.click(), style: {
                                    width: 'fit-content',
                                    margin: '0 auto'
                                }, children: [_jsx(LuUpload, { size: 20 }), _jsx("span", { children: "Upload Image" })] }), file && (_jsx("div", { className: "lte-file-name", children: file.name }))] }), _jsx("div", { className: "lte-dialog-footer", children: _jsx("button", { type: "button", className: "lte-primary-btn", disabled: (!url && !file) || isUploading, onClick: addImage, children: isUploading ? "Uploading..." : "Add Image" }) })] })] }));
}
