interface FindReplaceModalProps {
    onClose: () => void;
}
/**
 * Find & Replace panel.
 * Matches are located per TextNode (a query spanning across two TextNodes is
 * not matched). The match list is recomputed on every editor change while the
 * panel is open, so stale node keys never reach a replace operation.
 */
export default function FindReplaceModal({ onClose }: FindReplaceModalProps): import("react/jsx-runtime").JSX.Element;
export {};
