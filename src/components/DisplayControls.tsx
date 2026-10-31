import TooltipX from "./common/Tooltip";
import { BsMoon, BsSun, BsThreeDots } from "react-icons/bs";
import { MdMonitor, MdWrapText } from "react-icons/md";
import { TbArrowsLeftRight } from "react-icons/tb";

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
export default function DisplayControls({
  theme,
  toolbarStyle: styleRaw,
  onThemeChange,
  onToolbarStyleChange,
}: DisplayControlsProps) {
  // Legacy value normalization (mirrors ToolbarPlugin's mapping)
  const style: ToolbarStyle = styleRaw === "normal" ? "collapse" : styleRaw;

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light theme", icon: <BsSun /> },
    { value: "dark", label: "Dark theme", icon: <BsMoon /> },
    { value: "system", label: "Follow system theme", icon: <MdMonitor /> },
  ];
  const styles: { value: ToolbarStyle; label: string; icon: React.ReactNode }[] = [
    { value: "wrap", label: "Toolbar: wrap to new lines", icon: <MdWrapText /> },
    { value: "collapse", label: "Toolbar: collapse into \"...\"", icon: <BsThreeDots /> },
    { value: "scrollbar", label: "Toolbar: scroll in one row", icon: <TbArrowsLeftRight /> },
  ];

  return (
    <div className="lexical-display-controls" role="group" aria-label="Display settings">
      <div className="lte-mini-seg" role="radiogroup" aria-label="Theme">
        {themes.map((t) => (
          <TooltipX key={t.value} content={t.label} direction="top">
            <button
              type="button"
              role="radio"
              aria-checked={theme === t.value}
              aria-label={t.label}
              className={`lte-mini-btn btn ${theme === t.value ? "active" : ""}`}
              onClick={() => onThemeChange?.(t.value)}
            >
              {t.icon}
            </button>
          </TooltipX>
        ))}
      </div>
      <div className="lte-mini-seg" role="radiogroup" aria-label="Toolbar style">
        {styles.map((s) => (
          <TooltipX key={s.value} content={s.label} direction="top">
            <button
              type="button"
              role="radio"
              aria-checked={style === s.value}
              aria-label={s.label}
              className={`lte-mini-btn btn ${style === s.value ? "active" : ""}`}
              onClick={() => onToolbarStyleChange?.(s.value)}
            >
              {s.icon}
            </button>
          </TooltipX>
        ))}
      </div>
    </div>
  );
}
