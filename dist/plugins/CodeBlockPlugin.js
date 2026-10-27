import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { useEffect, useRef, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { CODE_BLOCK_LANGUAGES, LOW_PRIORIRTY } from "../constants";
import { HiChevronDown } from "react-icons/hi2";
import { IoCodeSlashOutline } from "react-icons/io5";
import { Popover, PopoverContent, PopoverTrigger, } from "../components/common/Popover";
export default function CodeBlockPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isActive, setIsActive] = useState(false);
    const [language, setLanguage] = useState(null);
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    const updateState = () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === "root"
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow();
            const isCode = $isCodeNode(element);
            setIsActive(isCode);
            if (isCode)
                setLanguage(element.getLanguage() ?? null);
        }
    };
    useEffect(() => {
        return mergeRegister(editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateState();
            });
        }), editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            updateState();
            return false;
        }, LOW_PRIORIRTY));
    }, [editor]);
    const toggleCodeBlock = (lang) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection))
                return;
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === "root"
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow();
            if ($isCodeNode(element)) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
            else {
                const languageToUse = lang ?? language ?? "javascript";
                $setBlocksType(selection, () => $createCodeNode(languageToUse));
            }
        });
    };
    const applyLanguage = (lang) => {
        setLanguage(lang);
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection))
                return;
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === "root"
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow();
            if ($isCodeNode(element))
                element.setLanguage(lang);
        });
    };
    const activeLabel = CODE_BLOCK_LANGUAGES.find((l) => l.id === language)?.label ?? "Plain Text";
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { triggerRef: triggerRef, children: _jsxs("button", { type: "button", className: `lexical-btn heading-trigger ${isActive ? "toolbar-active" : "toolbar"}`, onClick: () => setOpen((prev) => !prev), children: [_jsx(IoCodeSlashOutline, {}), _jsx("span", { children: activeLabel }), _jsx(HiChevronDown, { className: `chevron ${open ? "rotated" : ""}` })] }) }), _jsx(PopoverContent, { open: open, align: "start", onClose: () => setOpen(false), contentRef: contentRef, children: _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 5 }, children: [_jsxs("button", { type: "button", className: `lexical-btn ${isActive ? "toolbar-active" : "toolbar"}`, onClick: () => {
                                toggleCodeBlock();
                                setOpen(false);
                            }, style: { minWidth: 150 }, children: [_jsx(IoCodeSlashOutline, {}), _jsx("span", { className: "label", children: isActive ? "Remove Code Block" : "Code Block" })] }), _jsx("div", { className: "w-full h-[1px] bg-gray-200 my-1" }), _jsx("div", { style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 5,
                                maxHeight: 260,
                                overflowY: "auto",
                            }, children: CODE_BLOCK_LANGUAGES.map(({ id, label }) => (_jsx("button", { type: "button", className: `lexical-btn ${language === id ? "toolbar-active" : "toolbar"}`, onClick: () => {
                                    applyLanguage(id);
                                    setOpen(false);
                                }, style: { minWidth: 150 }, children: _jsx("span", { className: "label", children: label }) }, id))) })] }) })] }));
}
