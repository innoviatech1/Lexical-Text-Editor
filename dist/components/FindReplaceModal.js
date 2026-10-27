import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $getNodeByKey, $isTextNode } from "lexical";
import { useEffect, useRef, useState } from "react";
import { IoChevronDown, IoChevronUp, IoClose } from "react-icons/io5";
/**
 * Find & Replace panel.
 * Matches are located per TextNode (a query spanning across two TextNodes is
 * not matched). The match list is recomputed on every editor change while the
 * panel is open, so stale node keys never reach a replace operation.
 */
export default function FindReplaceModal({ onClose }) {
    const [editor] = useLexicalComposerContext();
    const [query, setQuery] = useState("");
    const [replacement, setReplacement] = useState("");
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [matches, setMatches] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const searchInputRef = useRef(null);
    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);
    const collectMatches = () => {
        if (!query)
            return [];
        const needle = caseSensitive ? query : query.toLowerCase();
        const result = [];
        const textNodes = $getRoot().getAllTextNodes();
        for (const node of textNodes) {
            const haystack = caseSensitive
                ? node.getTextContent()
                : node.getTextContent().toLowerCase();
            let index = haystack.indexOf(needle);
            while (index !== -1) {
                result.push({ key: node.getKey(), start: index });
                index = haystack.indexOf(needle, index + needle.length);
            }
        }
        return result;
    };
    // Recompute on query / case-sensitivity change
    useEffect(() => {
        const found = editor.getEditorState().read(collectMatches);
        setMatches(found);
        setCurrentIndex(0);
    }, [editor, query, caseSensitive]);
    // Keep match list in sync while the panel is open
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            const found = editorState.read(collectMatches);
            setMatches(found);
            setCurrentIndex((prev) => found.length === 0 ? 0 : Math.min(prev, found.length - 1));
        });
    }, [editor, query, caseSensitive]);
    const navigate = (direction) => {
        if (matches.length === 0)
            return;
        const next = (currentIndex + direction + matches.length) % matches.length;
        const match = matches[next];
        setCurrentIndex(next);
        editor.update(() => {
            const node = $getNodeByKey(match.key);
            if ($isTextNode(node)) {
                node.select(match.start, match.start + query.length);
            }
        });
        requestAnimationFrame(() => {
            const element = editor.getElementByKey(match.key);
            element?.scrollIntoView({ block: "nearest" });
        });
    };
    const replaceCurrent = () => {
        editor.update(() => {
            const localMatches = collectMatches();
            if (localMatches.length === 0) {
                setMatches([]);
                setCurrentIndex(0);
                return;
            }
            const index = Math.min(currentIndex, localMatches.length - 1);
            const match = localMatches[index];
            const node = $getNodeByKey(match.key);
            if (!$isTextNode(node))
                return;
            // `moveSelection` places the caret at the end of the replaced text
            node.spliceText(match.start, query.length, replacement, true);
        });
    };
    const replaceAll = () => {
        editor.update(() => {
            const localMatches = collectMatches();
            // Reverse order so replacing a match never shifts earlier offsets.
            // Single `editor.update` => one undo step.
            for (let i = localMatches.length - 1; i >= 0; i--) {
                const match = localMatches[i];
                const node = $getNodeByKey(match.key);
                if ($isTextNode(node)) {
                    node.spliceText(match.start, query.length, replacement, false);
                }
            }
        });
    };
    const hasQuery = query.length > 0;
    const hasMatches = matches.length > 0;
    return (_jsxs("div", { className: "lexical-find-replace", onKeyDown: (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        }, children: [_jsxs("div", { className: "lexical-fr-row", children: [_jsx("input", { ref: searchInputRef, className: "lexical-fr-input", placeholder: "Find", value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: (e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                navigate(e.shiftKey ? -1 : 1);
                            }
                        } }), _jsx("span", { className: "lexical-fr-count", children: hasMatches
                            ? `${currentIndex + 1} of ${matches.length}`
                            : hasQuery
                                ? "0 results"
                                : "" })] }), _jsx("div", { className: "lexical-fr-row", children: _jsx("input", { className: "lexical-fr-input", placeholder: "Replace with", value: replacement, onChange: (e) => setReplacement(e.target.value) }) }), _jsxs("div", { className: "lexical-fr-row", children: [_jsxs("label", { className: "lexical-fr-case", children: [_jsx("input", { type: "checkbox", checked: caseSensitive, onChange: (e) => setCaseSensitive(e.target.checked) }), _jsx("span", { children: "Match case" })] }), _jsx("span", { style: { flex: 1 } }), _jsx("button", { type: "button", className: "lexical-btn toolbar", onClick: () => navigate(-1), disabled: !hasMatches, "aria-label": "Previous match", children: _jsx(IoChevronUp, {}) }), _jsx("button", { type: "button", className: "lexical-btn toolbar", onClick: () => navigate(1), disabled: !hasMatches, "aria-label": "Next match", children: _jsx(IoChevronDown, {}) }), _jsx("button", { type: "button", className: "lexical-btn toolbar", onClick: replaceCurrent, disabled: !hasMatches, children: "Replace" }), _jsx("button", { type: "button", className: "lexical-btn toolbar", onClick: replaceAll, disabled: !hasMatches, children: "Replace All" }), _jsx("button", { type: "button", className: "lexical-btn toolbar", onClick: onClose, "aria-label": "Close find and replace", children: _jsx(IoClose, {}) })] })] }));
}
