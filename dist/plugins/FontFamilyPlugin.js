import { jsx as _jsx } from "react/jsx-runtime";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from 'lexical';
import { $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection';
import { useEffect, useState } from 'react';
import { mergeRegister } from '@lexical/utils';
import { LOW_PRIORIRTY } from '../constants';
import { RiFontFamily } from 'react-icons/ri';
import { FontSelectionList } from '../components/FontSelectionList';
import TooltipX from '../components/common/Tooltip';
const FONT_FAMILY_OPTIONS = [
    { id: "", label: "Default" },
    { id: "Inter", label: "Inter" },
    { id: "System UI", label: "System" },
    { id: "serif", label: "Serif" },
    { id: "monospace", label: "Monospace" },
    { id: "cursive", label: "Cursive" },
    { id: "Georgia", label: "Georgia" },
    { id: "Courier New", label: "Courier" },
];
/** Inline styles serialize with quotes (e.g. `'Inter', serif`) — strip them for comparison. */
const normalizeFontFamily = (value) => value.replace(/['"]/g, '').trim();
export default function FontFamilyPlugin() {
    const [editor] = useLexicalComposerContext();
    const [fontFamily, setFontFamily] = useState("");
    const updateToolbar = () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const value = $getSelectionStyleValueForProperty(selection, "font-family", "");
            setFontFamily(normalizeFontFamily(value));
        }
    };
    useEffect(() => {
        return mergeRegister(editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        }), editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            updateToolbar();
            return false;
        }, LOW_PRIORIRTY));
    }, [editor]);
    const updateFontFamily = (value) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                // `null` removes the property so text inherits the theme font
                $patchStyleText(selection, { 'font-family': value === "" ? null : value });
            }
        });
    };
    return (_jsx(TooltipX, { content: "Font Family", direction: "bottom", children: _jsx(FontSelectionList, { icon: _jsx(RiFontFamily, {}), tooltipLabel: "Font Family", currentValue: fontFamily, options: FONT_FAMILY_OPTIONS, onSelect: updateFontFamily }) }));
}
