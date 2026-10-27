import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { useRef, useState } from "react";
export const ImageComponent = ({ src, altText, nodeKey, width, height, maxWidth, caption = "", }) => {
    const [editor] = useLexicalComposerContext();
    const [editingCaption, setEditingCaption] = useState(false);
    const [captionText, setCaptionText] = useState(caption);
    const captionInputRef = useRef(null);
    const dragSizeRef = useRef(null);
    const wrapperRef = useRef(null);
    const startPos = useRef(null);
    const onMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const img = wrapperRef.current?.querySelector("img");
        if (!img)
            return;
        const renderedWidth = img.getBoundingClientRect().width;
        const naturalRatio = img.naturalHeight / img.naturalWidth;
        const renderedHeight = renderedWidth * naturalRatio;
        startPos.current = {
            x: e.clientX,
            y: e.clientY,
            width: renderedWidth,
            height: renderedHeight,
        };
        dragSizeRef.current = {
            width: renderedWidth,
            height: renderedHeight,
            ratio: naturalRatio,
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };
    const onMouseMove = (e) => {
        if (!startPos.current || !dragSizeRef.current)
            return;
        const deltaX = e.clientX - startPos.current.x;
        const newWidth = Math.min(maxWidth, Math.max(50, startPos.current.width + deltaX));
        const newHeight = newWidth * dragSizeRef.current.ratio;
        dragSizeRef.current.width = newWidth;
        dragSizeRef.current.height = newHeight;
        const img = wrapperRef.current?.querySelector("img");
        if (img) {
            img.style.width = newWidth + "px";
            img.style.height = newHeight + "px";
        }
    };
    const onMouseUp = () => {
        if (!dragSizeRef.current)
            return;
        const { width: finalWidth, height: finalHeight } = dragSizeRef.current;
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node && typeof node.updateDimensions === "function") {
                node.updateDimensions(finalWidth, finalHeight);
            }
        });
        dragSizeRef.current = null;
        startPos.current = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    };
    const saveCaption = () => {
        setEditingCaption(false);
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node && typeof node.setCaption === "function") {
                node.setCaption(captionText);
            }
        });
    };
    const startCaptionEdit = () => {
        setCaptionText(caption);
        setEditingCaption(true);
        setTimeout(() => captionInputRef.current?.focus(), 0);
    };
    return (_jsxs("div", { ref: wrapperRef, style: {
            display: "inline-block",
            position: "relative",
            maxWidth,
        }, children: [_jsx("img", { src: src, alt: altText, width: width === "inherit" ? undefined : width, height: height === "inherit" ? undefined : height, style: {
                    maxWidth: "100%",
                    display: "block",
                } }), (caption || editingCaption) && (_jsx("div", { style: { textAlign: "center", marginTop: 4 }, children: editingCaption ? (_jsx("input", { ref: captionInputRef, className: "lte-input", style: { width: "100%", textAlign: "center" }, value: captionText, onChange: (e) => setCaptionText(e.target.value), onBlur: saveCaption, onKeyDown: (e) => {
                        if (e.key === "Enter")
                            saveCaption();
                    } })) : (_jsx("span", { style: {
                        fontSize: 13,
                        color: "#666",
                        cursor: "text",
                        display: "inline-block",
                        minWidth: 20,
                        minHeight: 18,
                    }, onClick: startCaptionEdit, children: caption })) })), !caption && !editingCaption && (_jsx("div", { style: { textAlign: "center", marginTop: 2 }, children: _jsx("span", { style: {
                        fontSize: 12,
                        color: "#999",
                        cursor: "pointer",
                    }, onClick: startCaptionEdit, children: "+ Add caption" }) })), _jsx("div", { onMouseDown: onMouseDown, style: {
                    position: "absolute",
                    bottom: caption || editingCaption ? 40 : 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    background: "white",
                    border: "1px solid #999",
                    cursor: "nwse-resize",
                    borderRadius: 2,
                } })] }));
};
