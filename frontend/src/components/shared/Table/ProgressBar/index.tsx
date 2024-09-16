import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Custom
import { CustomProgressBar, CustomProgressBarWrapper } from "./styles";

export function ProgressBar({ current, max }) {
  const progress = (current / max) * 100;
  const background = current > 0 ? "var(--text-default)" : "var(--muted)";

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>{`${current}h de ${max}h`}</Tooltip>}
    >
      <CustomProgressBarWrapper>
        <CustomProgressBar
          animated
          now={progress}
          variant="success"
          background={background}
        />
        <span>{current}/{max}</span>
      </CustomProgressBarWrapper>
    </OverlayTrigger>
  );
}

export default ProgressBar;