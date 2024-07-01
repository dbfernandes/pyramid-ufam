import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { StatusSubmissions } from "constants/statusSubmissions.constants";
import { getToken } from "utils";

// Shared
import { MultiField, FormAlert, SectionTitle } from "components/shared/Form/styles";
import TextArea from "components/shared/TextArea";
import { Button, DangerButton } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import Content from "components/shared/ModalForm/Content";
import { toast } from "react-toastify";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";

interface IFormUpdateStatusSubmissionProps {
  submission: any; //ISubmission;
  user: IUserLogged;
  status: string;
  onChange?: Function;
  handleCloseModalForm?: Function;
}

export default function FormUpdateStatusSubmission({
  submission,
  user,
  status,
  onChange = () => { },
  handleCloseModalForm,
}: IFormUpdateStatusSubmissionProps) {
  // Inputs and validators
  const [details, setDetails] = useState<string>("");
  const handleDetails = (value) => {
    setDetails(value);
  };

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Add or Edit
  function handleUpdateStatus(e) {
    e.preventDefault();
    setSent(true);

    fetchUpdateStatus();
  }

  async function fetchUpdateStatus() {
    setFetching(true);

    const options = {
      url: `${process.env.api}/submissions/${submission.id}/status`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      data: {
        userId: user.id,
        status: status,
        details: details
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        toast.success("Status atualizado com sucesso.");
        onChange();
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    if (handleCloseModalForm) {
      handleCloseModalForm();
    }

    setFetching(false);
  }

  const verbs = {
    "Aprovado": "Aprovar",
    "Rejeitado": "Rejeitar",
    "Pré-aprovado": "Pré-aprovar",
  };

  return (
    <Content>
      <div style={{ width: "100%" }}>
        <SectionTitle>
          <b>(Opcional):</b> Alguma observação sobre o motivo da mudança de status?
        </SectionTitle>

        <TextArea
          label={"Observações"}
          name={"details"}
          value={details}
          handleValue={handleDetails}
          displayAlert={sent}
          maxLength={255}
        />
      </div>

      <div style={{ width: "100%" }}>
        <>
          {sent && !success && error.length != 0 && (
            <FormAlert>{error}</FormAlert>
          )}
        </>

        {status == "Rejeitado"
          ? <DangerButton style={{ marginTop: 15 }} onClick={(e) => handleUpdateStatus(e)}>
            {fetching ? (
              <Spinner size={"20px"} color={"var(--black-1)"} />
            ) : (
              <>
                <i className="bi bi-x-lg" />
                {verbs[status]}
              </>
            )}
          </DangerButton>
          : <Button style={{ marginTop: 15 }} onClick={(e) => handleUpdateStatus(e)}>
            {fetching ? (
              <Spinner size={"20px"} color={"var(--black-1)"} />
            ) : (
              <>
                <i className="bi bi-check2-all" />
                {verbs[status]}
              </>
            )}
          </Button>
        }
      </div>
    </Content>
  );
};