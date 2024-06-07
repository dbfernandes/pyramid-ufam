import { useEffect, useState } from "react";

// Custom
import {
  Wrapper,
  Alert
} from "./styles";

// Interface
interface IFileDropProps {
  file: any;
  setFile: React.SetStateAction<any>;
  allowedTypes?: string[];
  maxSize?: number;
  required?: boolean;
  displayAlert?: boolean;
}

export default function FileDrop({
  file,
  setFile,
  maxSize = -1,
  allowedTypes = [],
  required = false,
  displayAlert = false
}: IFileDropProps) {
  const [dragging, setDragging] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");
  const [forceDisplayAlert, setForceDisplayAlert] = useState<boolean>(false);

  function validateFile(file) {
    if (file == null) return false;
    if (!allowedTypes.includes(file.type)) {
      setAlert("Somente arquivos PDF são permitidos");
      setForceDisplayAlert(true);

      return false;
    } else if (maxSize != -1 && file.size > maxSize) {
      setAlert("Somente arquivos até 5 mb são permitidos");
      setForceDisplayAlert(true);

      return false;
    }

    return true;
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;

    if (files.length > 0 && validateFile(files[0])) {
      setFile(files[0]);
      setForceDisplayAlert(false);
      setAlert("");
    }

    setDragging(false);
  }

  const handleFileSet = (e) => {
    const { files } = e.target;

    if (files.length > 0 && validateFile(files[0])) {
      setFile(files[0]);
      setForceDisplayAlert(false);
      setAlert("");
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id)
  }

  useEffect(() => {
    if (displayAlert && file == null) {
      setAlert("Envio de arquivo obrigatório");
    }
  }, [displayAlert]);

  return (
    <Wrapper
      className="file-upload-area"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      dragging={dragging}
      displayAlert={(displayAlert || forceDisplayAlert) && !validateFile(file)}>
      <div draggable="true" onDragStart={handleDragStart}>
        <div className="file-upload-div">
          {((displayAlert || forceDisplayAlert) && !validateFile(file)) && <Alert>{alert}</Alert>}

          <i className={`bi bi-${file ? "file-earmark-pdf" : "cloud-arrow-up"}`} />

          <p>
            {file
              ? file.name
              : <>
                <b>Clique aqui</b> para enviar um arquivo ou <br /><b>arraste e solte</b> o arquivo dentro da área marcada
              </>
            }</p>

          <input
            type="file"
            onChange={(e) => handleFileSet(e)}
          />
        </div>
      </div>
    </Wrapper>
  );
}