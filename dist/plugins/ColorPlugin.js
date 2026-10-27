import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import ColorPicker from '../components/ColorPicker';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from 'lexical';
import { $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection';
import { useEffect, useState } from 'react';
import { mergeRegister } from '@lexical/utils';
import { LOW_PRIORIRTY } from '../constants';
import { AiOutlineBgColors, AiOutlineFontColors } from 'react-icons/ai';
import TooltipX from '../components/common/Tooltip';
export default function ColorPlugin() {
    const [editor] = useLexicalComposerContext();
    const [{ color, bgColor }, setColors] = useState({
        color: '#000',
        bgColor: '#fff'
    });
    const updateToolbar = () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const color = $getSelectionStyleValueForProperty(selection, "color", "#000");
            const bgColor = $getSelectionStyleValueForProperty(selection, "background", "#fff");
            setColors({ color, bgColor });
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
    const updateColor = ({ property, color }) => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection)
                $patchStyleText(selection, { [property]: color });
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(TooltipX, { content: "Font Color", direction: "bottom", children: _jsx(ColorPicker, { color: color, onChange: (color) => {
                        updateColor({ property: 'color', color });
                    }, icon: _jsx(AiOutlineFontColors, {}) }) }), _jsx(TooltipX, { content: "Background Color", direction: "bottom", children: _jsx(ColorPicker, { color: bgColor, onChange: (color) => {
                        updateColor({ property: 'background', color });
                    }, icon: _jsx(AiOutlineBgColors, {}) }) })] }));
}
