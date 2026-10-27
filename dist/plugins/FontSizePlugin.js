import { jsx as _jsx } from "react/jsx-runtime";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from 'lexical';
import { $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection';
import { useEffect, useState } from 'react';
import { mergeRegister } from '@lexical/utils';
import { LOW_PRIORIRTY } from '../constants';
import { RiFontSize } from 'react-icons/ri';
import { FontSelectionList } from '../components/FontSelectionList';
import TooltipX from '../components/common/Tooltip';
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
const FONT_SIZE_OPTIONS = [
    { id: "", label: "Default" },
    ...FONT_SIZES.map((size) => ({ id: `${size}px`, label: `${size}` })),
];
/** Inline styles serialize as `16px` — strip the unit for display. */
const normalizeFontSize = (value) => value.trim();
export default function FontSizePlugin() {
    const [editor] = useLexicalComposerContext();
    const [fontSize, setFontSize] = useState("");
    const updateToolbar = () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const value = $getSelectionStyleValueForProperty(selection, "font-size", "");
            setFontSize(normalizeFontSize(value));
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
    const updateFontSize = (value) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                // `null` removes the property so text inherits the surrounding size
                $patchStyleText(selection, { 'font-size': value === "" ? null : value });
            }
        });
    };
    return (_jsx(TooltipX, { content: "Font Size", direction: "bottom", children: _jsx(FontSelectionList, { icon: _jsx(RiFontSize, {}), tooltipLabel: "Font Size", currentValue: fontSize, options: FONT_SIZE_OPTIONS, onSelect: updateFontSize }) }));
}
