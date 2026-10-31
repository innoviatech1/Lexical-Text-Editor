type Theme = "light" | "dark" | "system";
type ToolbarStyle = "wrap" | "collapse" | "scrollbar";
interface DisplayControlsProps {
    theme: Theme;
    toolbarStyle: ToolbarStyle | "normal";
    onThemeChange?: (theme: Theme) => void;
    onToolbarStyleChange?: (style: ToolbarStyle) => void;
}
/**
 * Small user-facing display switchers at the right edge of the status bar:
 * theme (light / dark / system) and toolbar drawing style (wrap / collapse /
 * scrollbar). Complements the developer props — either can change the value;
 * the component's internal state (initialized from the props) is what renders.
 */
export default function DisplayControls({ theme, toolbarStyle: styleRaw, onThemeChange, onToolbarStyleChange, }: DisplayControlsProps): import("react/jsx-runtime").JSX.Element;
export {};
