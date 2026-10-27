import { $applyNodeReplacement, $isTextNode, TextNode } from 'lexical';
export class ExtendedTextNode extends TextNode {
    constructor(text, key) {
        super(text, key);
    }
    static getType() {
        return 'extended-text';
    }
    static clone(node) {
        return new ExtendedTextNode(node.__text, node.__key);
    }
    static importDOM() {
        const importers = TextNode.importDOM();
        return {
            ...importers,
            span: () => ({
                conversion: patchStyleConversion(importers?.span),
                priority: 1
            }),
            div: () => ({
                conversion: patchStyleConversion(importers?.div),
                priority: 1
            }),
            p: () => ({
                conversion: patchStyleConversion(importers?.p),
                priority: 1
            }),
            b: () => ({
                conversion: patchStyleConversion(importers?.b),
                priority: 1
            }),
            strong: () => ({
                conversion: patchStyleConversion(importers?.strong),
                priority: 1
            }),
            i: () => ({
                conversion: patchStyleConversion(importers?.i),
                priority: 1
            }),
            em: () => ({
                conversion: patchStyleConversion(importers?.em),
                priority: 1
            }),
            u: () => ({
                conversion: patchStyleConversion(importers?.u),
                priority: 1
            }),
            s: () => ({
                conversion: patchStyleConversion(importers?.s),
                priority: 1
            }),
            strike: () => ({
                conversion: patchStyleConversion(importers?.strike),
                priority: 1
            }),
            code: () => ({
                conversion: patchStyleConversion(importers?.code),
                priority: 1
            })
        };
    }
    static importJSON(serializedNode) {
        return $createExtendedTextNode().updateFromJSON(serializedNode);
    }
    isSimpleText() {
        return this.__type === 'extended-text' && this.__mode === 0;
    }
}
export function $createExtendedTextNode(text = '') {
    return $applyNodeReplacement(new ExtendedTextNode(text));
}
export function $isExtendedTextNode(node) {
    return node instanceof ExtendedTextNode;
}
// Helper function to patch style conversion
function patchStyleConversion(originalDOMConverter) {
    return (node) => {
        const original = originalDOMConverter?.(node);
        if (!original) {
            return null;
        }
        const originalOutput = original.conversion(node);
        if (!originalOutput) {
            return originalOutput;
        }
        // Extract all style properties
        const style = node.style;
        const styleAttributes = [];
        if (style.backgroundColor) {
            styleAttributes.push(`background-color: ${style.backgroundColor}`);
        }
        if (style.color) {
            styleAttributes.push(`color: ${style.color}`);
        }
        if (style.fontFamily) {
            styleAttributes.push(`font-family: ${style.fontFamily}`);
        }
        if (style.fontWeight) {
            styleAttributes.push(`font-weight: ${style.fontWeight}`);
        }
        if (style.fontSize) {
            styleAttributes.push(`font-size: ${style.fontSize}`);
        }
        if (style.fontStyle) {
            styleAttributes.push(`font-style: ${style.fontStyle}`);
        }
        if (style.textDecoration) {
            styleAttributes.push(`text-decoration: ${style.textDecoration}`);
        }
        if (style.whiteSpace) {
            styleAttributes.push(`white-space: ${style.whiteSpace}`);
        }
        if (style.textAlign) {
            styleAttributes.push(`text-align: ${style.textAlign}`);
        }
        const inlineStyle = node.getAttribute('style');
        if (inlineStyle) {
            // Parse the style string to avoid duplicates
            const stylePairs = inlineStyle.split(';').filter(pair => pair.trim());
            stylePairs.forEach(pair => {
                const [property] = pair.split(':').map(s => s.trim());
                if (property && !styleAttributes.some(attr => attr.startsWith(property))) {
                    styleAttributes.push(pair.trim());
                }
            });
        }
        return {
            ...originalOutput,
            forChild: (lexicalNode, parent) => {
                const originalForChild = originalOutput?.forChild ?? ((x) => x);
                const result = originalForChild(lexicalNode, parent);
                if ($isTextNode(result) && styleAttributes.length > 0) {
                    const styleString = styleAttributes.join('; ');
                    return result.setStyle(styleString);
                }
                return result;
            }
        };
    };
}
