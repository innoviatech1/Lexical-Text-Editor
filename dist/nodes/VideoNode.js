import { jsx as _jsx } from "react/jsx-runtime";
import { DecoratorNode, } from "lexical";
export const $createVideoNode = ({ id, provider, }) => {
    return new VideoNode({ id, provider });
};
const ID_ATTR = "data-lexical-video";
const PROVIDER_ATTR = "data-provider";
const HEIGHT = "315px";
const WIDTH = "560px";
const getEmbedLink = (id, provider) => {
    if (provider === "drive") {
        return `https://drive.google.com/file/d/${id}/preview`;
    }
    return `https://www.youtube-nocookie.com/embed/${id}`;
};
const convertVideoElement = (domNode) => {
    const id = domNode?.getAttribute(ID_ATTR);
    const provider = domNode?.getAttribute(PROVIDER_ATTR) ?? "youtube";
    if (!id)
        return null;
    const node = $createVideoNode({ id, provider });
    return { node };
};
export class VideoNode extends DecoratorNode {
    constructor({ id, provider, key, }) {
        super(key);
        this.__id = id;
        this.__provider = provider;
    }
    static getType() {
        return "video";
    }
    static clone(node) {
        return new VideoNode({
            id: node.__id,
            provider: node.__provider,
            key: node.getKey(),
        });
    }
    static importJSON(serializedNode) {
        return $createVideoNode({
            id: serializedNode.id,
            provider: serializedNode.provider,
        });
    }
    exportJSON() {
        return {
            id: this.__id,
            provider: this.__provider,
            type: "video",
            version: 1,
        };
    }
    updateDOM() {
        return false;
    }
    decorate() {
        return (_jsx("iframe", { height: HEIGHT, width: WIDTH, src: getEmbedLink(this.__id, this.__provider), frameBorder: "0", allowFullScreen: true }));
    }
    createDOM() {
        return document.createElement("div");
    }
    exportDOM() {
        const iframe = document.createElement("iframe");
        iframe.setAttribute(ID_ATTR, this.__id);
        iframe.setAttribute(PROVIDER_ATTR, this.__provider);
        iframe.setAttribute("height", HEIGHT);
        iframe.setAttribute("width", WIDTH);
        iframe.setAttribute("src", getEmbedLink(this.__id, this.__provider));
        return { element: iframe };
    }
    static importDOM() {
        return {
            iframe: () => ({
                conversion: convertVideoElement,
                priority: 0,
            }),
        };
    }
}
