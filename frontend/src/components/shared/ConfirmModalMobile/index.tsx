import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// Shared
import { H3 } from "components/shared/Titles";
import { Button, ButtonAlt } from "components/shared/Button";

// Custom
import { CustomSheet, ButtonGroup } from "./styles";

export default function confirm(
  onConfirm: Function,
  title: string = "Tem certeza?",
  confirmText: null | string = "Confirmar",
  message: string = "",
  children: React.ReactNode = <></>
) {
  const modalContainer = document.createElement("div");

  const id = `modal-container-${Math.random()}`;

  modalContainer.setAttribute("id", id);
  document.getElementById("modals")!.appendChild(modalContainer);
  const root = createRoot(modalContainer!); // createRoot(container!) if you use TypeScript

  function selfDestroy() {
    setTimeout(() => {
      root.unmount();
      document.getElementById("modals")!.removeChild(modalContainer);
    }, 100);
  }

  root.render(
    <ConfirmModalMobileComponent
      title={title}
      message={message}
      confirmText={confirmText}
      onConfirm={() => onConfirm()}
      onClose={() => selfDestroy()}
    >
      {children}
    </ConfirmModalMobileComponent>
  );
}

// Interface
interface IConfirmModalMobileComponentProps {
  title: string;
  message: string;
  confirmText: string | null;
  onConfirm: Function;
  onClose: Function;
  children?: React.ReactNode;
}

function ConfirmModalMobileComponent({
  title,
  message,
  confirmText = null,
  onConfirm,
  onClose,
  children,
}: IConfirmModalMobileComponentProps) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 100);
  }, []);

  function handleClose() {
    setOpen(false);
    onClose();
  }

  function handleConfirm() {
    onConfirm();
    handleClose();
  }

  return (
    <CustomSheet isOpen={isOpen} onClose={() => handleClose()}>
      <CustomSheet.Container>
        <CustomSheet.Header />
        <CustomSheet.Content>
          <H3>{title}</H3>

          {message.length > 0 && <p>{message}</p>}

          {children}

          {confirmText ? (
            <ButtonGroup>
              <ButtonAlt onClick={() => handleConfirm()}>
                {confirmText}
              </ButtonAlt>
              <Button onClick={() => handleClose()}>Voltar</Button>
            </ButtonGroup>
          ) : (
            <Button onClick={() => handleClose()}>Voltar</Button>
          )}
        </CustomSheet.Content>
      </CustomSheet.Container>

      <CustomSheet.Backdrop onClick={() => handleClose()} />
    </CustomSheet>
  );
}
