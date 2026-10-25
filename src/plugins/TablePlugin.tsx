import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $findCellNode, $isTableCellNode, $deleteTableColumnAtSelection, $deleteTableRowAtSelection, $insertTableColumnAtSelection, $insertTableRowAtSelection, TableCellHeaderStates, INSERT_TABLE_COMMAND } from "@lexical/table";
import { useEffect, useRef, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { HiChevronDown } from "react-icons/hi2";
import { BsTable } from "react-icons/bs";
import { LOW_PRIORIRTY } from "../constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/common/Popover";

const GRID_SIZE = 5;

export default function TablePlugin() {
  const [editor] = useLexicalComposerContext();
  const [insideTable, setInsideTable] = useState(false);
  const [open, setOpen] = useState(false);
  const [gridHover, setGridHover] = useState<{ rows: number; cols: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const updateState = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const cell = $findCellNode(selection.anchor.getNode());
      setInsideTable(!!cell);
    } else {
      setInsideTable(false);
    }
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateState();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateState();
          return false;
        },
        LOW_PRIORIRTY
      )
    );
  }, [editor]);

  const insertTable = (rows: number, cols: number) => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: String(rows),
      columns: String(cols),
      includeHeaders: false,
    });
    setOpen(false);
  };

  const runTableOp = (op: () => void) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      op();
    });
    setOpen(false);
  };

  const toggleHeaderRow = () => {
    runTableOp(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const cell = $findCellNode(selection.anchor.getNode());
      if (!cell) return;
      const row = cell.getParent();
      if (!row) return;
      const cells = row.getChildren().filter($isTableCellNode);
      const isHeader = cells.some((c) => c.hasHeaderState(TableCellHeaderStates.ROW));
      for (const c of cells) {
        c.setHeaderStyles(
          isHeader ? TableCellHeaderStates.NO_STATUS : TableCellHeaderStates.ROW,
          TableCellHeaderStates.ROW
        );
      }
    });
  };

  const gridLabel = gridHover ? `${gridHover.rows} × ${gridHover.cols}` : "Insert Table";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger triggerRef={triggerRef}>
        <button
          type="button"
          className={`lexical-btn heading-trigger ${insideTable ? "toolbar-active" : "toolbar"}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <BsTable />
          <HiChevronDown className={`chevron ${open ? "rotated" : ""}`} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        open={open}
        align="start"
        onClose={() => setOpen(false)}
        contentRef={contentRef}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Dimension grid picker */}
          <div style={{ width: "fit-content" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_SIZE}, 18px)`,
                gap: 3,
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
                const r = Math.floor(idx / GRID_SIZE) + 1;
                const c = (idx % GRID_SIZE) + 1;
                const active = gridHover && r <= gridHover.rows && c <= gridHover.cols;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setGridHover({ rows: r, cols: c })}
                    onClick={() => insertTable(r, c)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 3,
                      border: "1px solid #d1d5db",
                      backgroundColor: active ? "#c7d2fe" : "#fff",
                      cursor: "pointer",
                    }}
                  />
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{gridLabel}</div>
          </div>

          <div className="w-full h-[1px] bg-gray-200" />

          {/* Row / column operations (enabled inside a table) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <button
              type="button"
              className={`lexical-btn ${insideTable ? "toolbar" : "toolbar"}`}
              disabled={!insideTable}
              onClick={() => runTableOp(() => { $insertTableRowAtSelection(false); })}
              style={{ minWidth: 160 }}
            >
              <span className="label">Insert row above</span>
            </button>
            <button
              type="button"
              className="lexical-btn toolbar"
              disabled={!insideTable}
              onClick={() => runTableOp(() => { $insertTableRowAtSelection(true); })}
              style={{ minWidth: 160 }}
            >
              <span className="label">Insert row below</span>
            </button>
            <button
              type="button"
              className="lexical-btn toolbar"
              disabled={!insideTable}
              onClick={() => runTableOp(() => { $deleteTableRowAtSelection(); })}
              style={{ minWidth: 160 }}
            >
              <span className="label">Delete row</span>
            </button>
            <button
              type="button"
              className="lexical-btn toolbar"
              disabled={!insideTable}
              onClick={() => runTableOp(() => { $insertTableColumnAtSelection(false); })}
              style={{ minWidth: 160 }}
            >
              <span className="label">Insert column left</span>
            </button>
            <button
              type="button"
              className="lexical-btn toolbar"
              disabled={!insideTable}
              onClick={() => runTableOp(() => { $insertTableColumnAtSelection(true); })}
              style={{ minWidth: 160 }}
            >
              <span className="label">Insert column right</span>
            </button>
            <button
              type="button"
              className="lexical-btn toolbar"
              disabled={!insideTable}
              onClick={() => runTableOp(() => { $deleteTableColumnAtSelection(); })}
              style={{ minWidth: 160 }}
            >
              <span className="label">Delete column</span>
            </button>
            <button
              type="button"
              className="lexical-btn toolbar"
              disabled={!insideTable}
              onClick={toggleHeaderRow}
              style={{ minWidth: 160 }}
            >
              <span className="label">Toggle header row</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
