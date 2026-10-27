import { type ReactNode } from "react";
export interface FontOption {
    /** CSS value applied to the selection. Empty string resets to default. */
    id: string;
    label: string;
}
interface Props {
    icon: ReactNode;
    tooltipLabel: string;
    /** Normalized current style value; empty string means "Default". */
    currentValue: string;
    options: FontOption[];
    onSelect: (value: string) => void;
    minWidth?: number;
}
export declare function FontSelectionList({ icon, tooltipLabel, currentValue, options, onSelect, minWidth }: Props): import("react/jsx-runtime").JSX.Element;
export {};
