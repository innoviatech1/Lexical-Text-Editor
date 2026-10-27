import { jsx as _jsx } from "react/jsx-runtime";
import { ImageComponent } from "../components/ImageComponent";
import { DecoratorNode, $applyNodeReplacement, } from "lexical";
export const $createImageNode = (payload) => {
    return $applyNodeReplacement(new ImageNode(payload));
};
const convertImageElement = (domNode) => {
    if (!(domNode instanceof HTMLImageElement))
        return null;
    const { src, alt } = domNode;
    let width;
    let height;
    // Attributes
    if (domNode.width)
        width = domNode.width;
    if (domNode.height)
        height = domNode.height;
    // Inline styles fallback
    const style = domNode.style;
    if ((!width || width === 0) && style.width) {
        const parsed = parseInt(style.width, 10);
        if (!Number.isNaN(parsed))
            width = parsed;
    }
    if ((!height || height === 0) && style.height) {
        const parsed = parseInt(style.height, 10);
        if (!Number.isNaN(parsed))
            height = parsed;
    }
    const node = $createImageNode({
        src,
        altText: alt,
        width: width ?? "inherit",
        height: height ?? "inherit",
    });
    return { node };
};
export class ImageNode extends DecoratorNode {
    constructor({ src = "", altText = "", maxWidth = 1080, width = "inherit", height = "inherit", caption = "", key, } = {
        src: "",
        altText: "",
    }) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__maxWidth = maxWidth;
        this.__width = width;
        this.__height = height;
        this.__caption = caption;
    }
    static getType() {
        return "image";
    }
    static clone(node) {
        return new ImageNode({
            src: node.__src,
            altText: node.__altText,
            width: node.__width,
            height: node.__height,
            maxWidth: node.__maxWidth,
            caption: node.__caption,
            key: node.getKey(),
        });
    }
    createDOM() {
        return document.createElement("span");
    }
    updateDOM(prevNode) {
        return (prevNode.__width !== this.__width ||
            prevNode.__height !== this.__height);
    }
    exportDOM() {
        const img = document.createElement("img");
        img.src = this.__src;
        img.alt = this.__altText;
        if (this.__width !== "inherit") {
            img.width = this.__width ?? 0;
        }
        if (this.__height !== "inherit") {
            img.height = this.__height ?? 0;
        }
        if (this.__caption) {
            const figure = document.createElement("figure");
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = this.__caption;
            figure.appendChild(img);
            figure.appendChild(figcaption);
            return { element: figure };
        }
        return { element: img };
    }
    static importDOM() {
        return {
            img: () => ({
                conversion: convertImageElement,
                priority: 1,
            }),
            figure: () => ({
                conversion: (node) => {
                    const img = node.querySelector("img");
                    if (!img)
                        return null;
                    const figcaption = node.querySelector("figcaption");
                    const caption = figcaption?.textContent || "";
                    const result = convertImageElement(img);
                    if (result?.node instanceof ImageNode && caption) {
                        result.node.__caption = caption;
                    }
                    return result;
                },
                priority: 1,
            }),
        };
    }
    exportJSON() {
        return {
            type: "image",
            version: 1,
            src: this.__src,
            altText: this.__altText,
            maxWidth: this.__maxWidth,
            width: this.__width,
            height: this.__height,
            caption: this.__caption,
        };
    }
    static importJSON(serializedNode) {
        return new ImageNode({
            src: serializedNode.src,
            altText: serializedNode.altText,
            maxWidth: serializedNode.maxWidth,
            width: serializedNode.width,
            height: serializedNode.height,
            caption: serializedNode.caption,
        });
    }
    updateDimensions(width, height) {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }
    setCaption(caption) {
        const writable = this.getWritable();
        writable.__caption = caption;
    }
    decorate() {
        return (_jsx(ImageComponent, { src: this.__src, altText: this.__altText, nodeKey: this.getKey(), width: this.__width, height: this.__height, maxWidth: this.__maxWidth, caption: this.__caption }));
    }
}
