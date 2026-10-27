import { jsx as _jsx } from "react/jsx-runtime";
import { DecoratorNode, } from "lexical";
export const $createYoutubeNode = ({ id }) => {
    return new YoutubeNode({ id });
};
const ID_ATTR = "data-lexical-youtube";
const HEIGHT = "315px";
const WIDTH = "560px";
const getYoutubeLink = (id) => `https://www.youtube-nocookie.com/embed/${id}`;
const convertYoutubeElement = (domNode) => {
    const id = domNode?.getAttribute(ID_ATTR);
    if (!id)
        return null;
    const node = $createYoutubeNode({ id });
    return { node };
};
export class YoutubeNode extends DecoratorNode {
    constructor({ id, key }) {
        super(key);
        this.__id = id;
    }
    static getType() {
        return "youtube";
    }
    static clone(node) {
        return new YoutubeNode({
            id: node.__id,
            key: node.getKey(),
        });
    }
    // Correctly typed importJSON
    static importJSON(serializedNode) {
        return $createYoutubeNode({ id: serializedNode.id });
    }
    exportJSON() {
        return {
            id: this.__id,
            type: "youtube",
            version: 1,
        };
    }
    decorate() {
        return (_jsx("iframe", { height: HEIGHT, width: WIDTH, src: getYoutubeLink(this.__id), frameBorder: "0", allowFullScreen: true }));
    }
    createDOM() {
        return document.createElement("div");
    }
    exportDOM() {
        const iframe = document.createElement("iframe");
        iframe.setAttribute(ID_ATTR, this.__id);
        iframe.setAttribute("height", HEIGHT);
        iframe.setAttribute("width", WIDTH);
        iframe.setAttribute("src", getYoutubeLink(this.__id));
        return { element: iframe };
    }
    static importDOM() {
        return {
            iframe: () => ({
                conversion: convertYoutubeElement,
                priority: 0,
            }),
        };
    }
}
