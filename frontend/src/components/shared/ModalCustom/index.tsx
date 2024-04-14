
import { Modal } from "react-bootstrap";

// Custom
import { ModalClose } from "./styles";
import styles from "./styles.module.scss";

// Interface
interface IModalCustomProps {
  show: boolean;
  close: () => void;
  size?: string;
  children?: React.ReactNode;
  [x: string]: any;
};

export default function ModalCustom({
  show,
  close,
  size = "medium",
  children,
  ...props
}: IModalCustomProps) {
  const sizeStyles = {
    "large": styles.customModalLarge,
    "medium": styles.customModalMedium,
    "small": styles.customModalSmall,
  };

  return (
    <Modal
      show={show}
      onHide={close}
      backdropClassName={styles.customModalBackdrop}
      dialogClassName={styles.customModalDialog}
      contentClassName={`${sizeStyles[size]} ${styles.customModalContent}`}>
      <ModalClose onClick={close}>
        <i className={"fas fa-times"}></i>
      </ModalClose>
      {children}
    </Modal>
  );
}