import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// Shared
import { H4 } from "components/shared/Titles";

// Custom
import {
  CustomModal
} from "./styles";

export default function toggleModalForm(
  title: string,
  Form: React.ReactNode = <></>,
  size?: string
) {
  const modalContainer = document.createElement('div');
  const id = `modal-container-${Math.random()}`;

  modalContainer.setAttribute('id', id);
  document.getElementById("modals")!.appendChild(modalContainer);
  const root = createRoot(modalContainer!);

  function selfDestroy() {
    setTimeout(() => {
      root.unmount();
      document.getElementById("modals")!.removeChild(modalContainer);
    }, 100);
  }

  root.render(
    <ModalForm title={title} size={size} onClose={() => selfDestroy()}>
      {Form}
    </ModalForm>
  );
}

// Interface
interface IModalFormProps {
  title: string;
  size?: string;
  onClose: Function;
  children?: React.ReactNode;
}

function ModalForm({ title, size = "lg", onClose, children }: IModalFormProps) {
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

  return (
    <CustomModal show={open} onHide={handleClose} size={size}>
      <CustomModal.Header closeButton>
        <CustomModal.Title>
          <H4>{title}</H4>
        </CustomModal.Title>
      </CustomModal.Header>

      <CustomModal.Body>
        {React.cloneElement(children as React.ReactElement, {
          handleCloseModalForm: handleClose,
        })}
        {/* Clone o elemento e adicione a prop handleClose */}
      </CustomModal.Body>
    </CustomModal>
  );
}
