import React from "react";
import type { ReactNode, ReactElement } from "react";
import { Tooltip } from "@mui/material";
import type { TooltipProps } from "@mui/material";
import useDisableClicks from "@learner/hooks/useDisableClicks";

interface SpeechAwareTooltipProps {
  children: ReactElement;
  title?: string;
  placement?: TooltipProps["placement"];
  // Any other props we want to pass to the Tooltip component
  [key: string]: any;
}

/**
 * A wrapper component that automatically adds speech-aware tooltips to clickable elements.
 * It shows a standard message when speech is active, and falls back to the provided title when not.
 */
const SpeechAwareTooltip: React.FC<SpeechAwareTooltipProps> = ({
  children,
  title = "",
  placement = "bottom",
  ...props
}) => {
  const { isSpeechActive } = useDisableClicks();

  const tooltipTitle = isSpeechActive
    ? "Navigation is paused while text-to-speech is active"
    : title;

  // If there's no title and speech is not active, don't wrap in a Tooltip at all
  if (!tooltipTitle) {
    return <>{children}</>;
  }

  return (
    <Tooltip title={tooltipTitle} placement={placement} {...props}>
      {children}
    </Tooltip>
  );
};

export default SpeechAwareTooltip;
