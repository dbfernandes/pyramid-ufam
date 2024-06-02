
import ReactDOM from "react-dom";

import { Toast } from "./styles";
import { createRoot } from "react-dom/client";

type errorTypes = "success" | "danger";

export default function toast(
  title: string,
  message: string,
  type: errorTypes = "success"
) {
  const toastContainer = document.createElement("div");

  const id = `toast-container${Math.random()}`;

  toastContainer.setAttribute("id", id);
  document.getElementById("modals")!.appendChild(toastContainer);
  const root = createRoot(toastContainer!); // createRoot(container!) if you use TypeScript

  root.render(<ToastComponent title={title} message={message} type={type} />);

  setTimeout(() => {
    root.unmount();
    document.getElementById("modals")!.removeChild(toastContainer);
  }, 3600);
}

interface IToastProps {
  title: string;
  message: string;
  type: errorTypes;
}

function ToastComponent({ title, message, type }: IToastProps) {
  return (
    <Toast type={type}>
      <h5>{title}</h5>
      {message && message.length > 0 && <p>{message}</p>}
    </Toast>
  );
}
