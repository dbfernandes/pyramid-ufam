import { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Custom
import { CopyToClipboardSpan } from "./styles";

export default function CopyToClipboard({ text }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function copyToClipboard(e) {
    e.stopPropagation();
    e.preventDefault();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    return () => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip>{`${text} (${copied ? "Copiado!" : "Clique para copiar"})`}</Tooltip>}>
      <CopyToClipboardSpan onClick={copyToClipboard}>
        {text}
        <i className="bi bi-copy" />
      </CopyToClipboardSpan>
    </OverlayTrigger>
  );
}