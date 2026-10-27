import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { BiUnlink } from "react-icons/bi";
export default function LinkModal({ linkUrl, setLinkUrl, onConfirm, onCancel, removeLink, }) {
    const [isEditMode, setEditMode] = useState(false);
    const editorRef = useRef(null);
    const inputRef = useRef(null);
    useEffect(() => {
        if (linkUrl === "https://")
            setEditMode(true);
    }, [linkUrl]);
    useEffect(() => {
        if (isEditMode)
            inputRef.current?.focus();
    }, [isEditMode]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (editorRef.current &&
                !editorRef.current.contains(event.target)) {
                onCancel();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onCancel]);
    return (_jsxs("div", { ref: editorRef, className: "lexical-text-editor-link link-editor-container", children: [_jsx("div", { className: "link-editor-input-wrapper", children: isEditMode ? (_jsx("input", { ref: inputRef, className: "link-editor-input", value: linkUrl, onChange: (e) => setLinkUrl(e.target.value), onKeyDown: (e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            onConfirm(linkUrl);
                            setEditMode(false);
                        }
                        else if (e.key === "Escape") {
                            e.preventDefault();
                            setEditMode(false);
                            onCancel();
                        }
                    } })) : (_jsx("a", { href: linkUrl, target: "_blank", rel: "noopener noreferrer", className: "link-editor-url", children: linkUrl })) }), _jsxs("div", { className: "link-editor-buttons", children: [_jsx("button", { type: "button", className: `lexical-btn heading-trigger toolbar`, onClick: () => {
                            if (isEditMode) {
                                onConfirm(linkUrl);
                                setEditMode(false);
                            }
                            else
                                setEditMode(true);
                        }, children: isEditMode ? _jsx(MdCheck, { size: 18 }) : _jsx(BsPencilSquare, { size: 14 }) }), _jsx("button", { type: "button", className: `lexical-btn heading-trigger toolbar`, onMouseDown: (e) => e.preventDefault(), onClick: removeLink, children: _jsx(BiUnlink, { size: 14, style: { stroke: 'black' } }) })] })] }));
}
