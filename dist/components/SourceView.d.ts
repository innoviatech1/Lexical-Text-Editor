interface SourceViewProps {
    /** Registered so the toolbar toggle can apply pending edits before exiting. */
    applyRef: React.MutableRefObject<(() => void) | null>;
    onExit: () => void;
}
/**
 * Raw HTML editing mode. The ContentEditable stays mounted (hidden) so the
 * editor state is preserved. Edited HTML is imported into the editor state
 * only on demand (Update / Done / toolbar toggle) — never per keystroke, so
 * undo history is not flooded and partially typed markup is not parsed.
 */
export default function SourceView({ applyRef, onExit }: SourceViewProps): import("react/jsx-runtime").JSX.Element;
export {};
