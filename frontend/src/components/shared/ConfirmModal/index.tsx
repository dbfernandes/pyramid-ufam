import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// Shared
import { H5 } from "components/shared/Titles";
import {Button, ButtonAlt } from "components/shared/Button";

// Custom
import { CustomModal, ButtonGroup } from "./styles";

export default function confirm(
  onConfirm: Function,
  title: string = "Tem certeza?",
  confirmText: null | string = "Confirmar",
  message: string = "",
  children: React.ReactNode = <></>
) {
  const modalContainer = document.createElement('div');

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
    <ConfirmModalComponent
      title={title}
      message={message}
      confirmText={confirmText}
      onConfirm={() => onConfirm()}
      onClose={() => selfDestroy()}
    >
      {children}
    </ConfirmModalComponent>
  );
}

// Interface
interface IConfirmModalComponentProps {
  title: string;
  message: string;
  confirmText: string | null;
  onConfirm: Function;
  onClose: Function;
  children?: React.ReactNode;
}

function ConfirmModalComponent({
  title,
  message,
  confirmText = null,
  onConfirm,
  onClose,
  children,
}: IConfirmModalComponentProps) {
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
    <CustomModal show={open} onHide={handleClose}>
      <CustomModal.Header closeButton>
        <CustomModal.Title>
          <H5>{title}</H5>
        </CustomModal.Title>
      </CustomModal.Header>

      {/*(message.length > 0 || children) &&
				<CustomModal.Body>
					{message.length > 0 && <p>{message}</p>}

					{children}
				</CustomModal.Body>
			*/}

      <CustomModal.Footer>
        {confirmText
          ? <ButtonGroup>
            <ButtonAlt onClick={() => handleConfirm()}>{confirmText}</ButtonAlt>
            <Button onClick={() => handleClose()}>Voltar</Button>
          </ButtonGroup>
          : <Button onClick={() => handleClose()}>Voltar</Button>
        }
      </CustomModal.Footer>
    </CustomModal >
  )
}
