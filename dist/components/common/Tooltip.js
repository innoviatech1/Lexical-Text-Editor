import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import '../../styles/lexical-editor.css';
const TooltipX = ({ content, direction = "top", delay = 400, children }) => {
    const [active, setActive] = useState(false);
    const timeout = useRef(null); // <-- browser setTimeout returns number
    const showTip = () => {
        timeout.current = window.setTimeout(() => {
            setActive(true);
        }, delay);
    };
    const hideTip = () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        setActive(false);
    };
    return (_jsxs("div", { className: "Lexical-Tooltip-Wrapper", onMouseEnter: showTip, onMouseLeave: hideTip, children: [children, active && (_jsx("div", { className: `Lexical-Tooltip-Tip ${direction}`, children: content }))] }));
};
export default TooltipX;
