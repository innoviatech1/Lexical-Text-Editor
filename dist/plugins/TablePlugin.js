import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, } from "lexical";
import { $findCellNode, $isTableCellNode, $deleteTableColumnAtSelection, $deleteTableRowAtSelection, $insertTableColumnAtSelection, $insertTableRowAtSelection, TableCellHeaderStates, INSERT_TABLE_COMMAND } from "@lexical/table";
import { useEffect, useRef, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { HiChevronDown } from "react-icons/hi2";
import { BsTable } from "react-icons/bs";
import { LOW_PRIORIRTY } from "../constants";
import { Popover, PopoverContent, PopoverTrigger, } from "../components/common/Popover";
const GRID_SIZE = 5;
export default function TablePlugin() {
    const [editor] = useLexicalComposerContext();
    const [insideTable, setInsideTable] = useState(false);
    const [open, setOpen] = useState(false);
    const [gridHover, setGridHover] = useState(null);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    const updateState = () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const cell = $findCellNode(selection.anchor.getNode());
            setInsideTable(!!cell);
        }
        else {
            setInsideTable(false);
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
    const insertTable = (rows, cols) => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: String(rows),
            columns: String(cols),
            includeHeaders: false,
        });
        setOpen(false);
    };
    const runTableOp = (op) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection))
                return;
            op();
        });
        setOpen(false);
    };
    const toggleHeaderRow = () => {
        runTableOp(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection))
                return;
            const cell = $findCellNode(selection.anchor.getNode());
            if (!cell)
                return;
            const row = cell.getParent();
            if (!row)
                return;
            const cells = row.getChildren().filter($isTableCellNode);
            const isHeader = cells.some((c) => c.hasHeaderState(TableCellHeaderStates.ROW));
            for (const c of cells) {
                c.setHeaderStyles(isHeader ? TableCellHeaderStates.NO_STATUS : TableCellHeaderStates.ROW, TableCellHeaderStates.ROW);
            }
        });
    };
    const gridLabel = gridHover ? `${gridHover.rows} × ${gridHover.cols}` : "Insert Table";
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { triggerRef: triggerRef, children: _jsxs("button", { type: "button", className: `lexical-btn heading-trigger ${insideTable ? "toolbar-active" : "toolbar"}`, onClick: () => setOpen((prev) => !prev), children: [_jsx(BsTable, {}), _jsx(HiChevronDown, { className: `chevron ${open ? "rotated" : ""}` })] }) }), _jsx(PopoverContent, { open: open, align: "start", onClose: () => setOpen(false), contentRef: contentRef, children: _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [_jsxs("div", { style: { width: "fit-content" }, children: [_jsx("div", { style: {
                                        display: "grid",
                                        gridTemplateColumns: `repeat(${GRID_SIZE}, 18px)`,
                                        gap: 3,
                                    }, children: Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
                                        const r = Math.floor(idx / GRID_SIZE) + 1;
                                        const c = (idx % GRID_SIZE) + 1;
                                        const active = gridHover && r <= gridHover.rows && c <= gridHover.cols;
                                        return (_jsx("div", { onMouseEnter: () => setGridHover({ rows: r, cols: c }), onClick: () => insertTable(r, c), style: {
                                                width: 18,
                                                height: 18,
                                                borderRadius: 3,
                                                border: "1px solid #d1d5db",
                                                backgroundColor: active ? "#c7d2fe" : "#fff",
                                                cursor: "pointer",
                                            } }, idx));
                                    }) }), _jsx("div", { style: { fontSize: 12, color: "#6b7280", marginTop: 4 }, children: gridLabel })] }), _jsx("div", { className: "w-full h-[1px] bg-gray-200" }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 5 }, children: [_jsx("button", { type: "button", className: `lexical-btn ${insideTable ? "toolbar" : "toolbar"}`, disabled: !insideTable, onClick: () => runTableOp(() => { $insertTableRowAtSelection(false); }), style: { minWidth: 160 }, children: _jsx("span", { className: "label", children: "Insert row above" }) }), _jsx("button", { type: "button", className: "lexical-btn toolbar", disabled: !insideTable, onClick: () => runTableOp(() => { $insertTableRowAtSelection(true); }), style: { minWidth: 160 }, children: _jsx("span", { className: "label", children: "Insert row below" }) }), _jsx("button", { type: "button", className: "lexical-btn toolbar", disabled: !insideTable, onClick: () => runTableOp(() => { $deleteTableRowAtSelection(); }), style: { minWidth: 160 }, children: _jsx("span", { className: "label", children: "Delete row" }) }), _jsx("button", { type: "button", className: "lexical-btn toolbar", disabled: !insideTable, onClick: () => runTableOp(() => { $insertTableColumnAtSelection(false); }), style: { minWidth: 160 }, children: _jsx("span", { className: "label", children: "Insert column left" }) }), _jsx("button", { type: "button", className: "lexical-btn toolbar", disabled: !insideTable, onClick: () => runTableOp(() => { $insertTableColumnAtSelection(true); }), style: { minWidth: 160 }, children: _jsx("span", { className: "label", children: "Insert column right" }) }), _jsx("button", { type: "button", className: "lexical-btn toolbar", disabled: !insideTable, onClick: () => runTableOp(() => { $deleteTableColumnAtSelection(); }), style: { minWidth: 160 }, children: _jsx("span", { className: "label", children: "Delete column" }) }), _jsx("button", { type: "button", className: "lexical-btn toolbar", disabled: !insideTable, onClick: toggleHeaderRow, style: { minWidth: 160 }, children: _jsx("span", { className: "label", children: "Toggle header row" }) })] })] }) })] }));
}
