import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { getFirstAndLastName, getToken, parseDateAndTime } from "utils";

// Shared
import confirm from "components/shared/ConfirmModal";
import Spinner from "components/shared/Spinner";
import toggleModalForm from "components/shared/ModalForm";
import { toast } from "react-toastify";
import FormUpdateStatusSubmission from "components/shared/forms/FormUpdateStatusSubmission";
import FormUpdateSubmission from "components/shared/forms/FormAddSubmission/FormUpdateSubmission";
import {
  ButtonGroup,
  AcceptButton,
  DangerButtonAlt,
  InfoButton,
  EditButton
} from "../styles";

// Custom
import { History, HistoryItem } from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import { UserRole } from "components/shared/Header/UserInfo/styles";
import { UserTypes } from "constants/userTypes.constants";
interface IUserActionsProps {
  submission: any; //ISubmission;
  user: IUserLogged;

  onChange?: Function;
}

export default function UserActions({
  submission,
  user,

  onChange = () => { }
}: IUserActionsProps) {
  // History
  const [fetchingHistory, setFetchingHistory] = useState<boolean>(true);
  const [history, setHistory] = useState<any[]>([]);
  async function fetchHistory() {
    setFetchingHistory(true);

    const options = {
      url: `${process.env.api}/submissions/${submission.id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setHistory(response.data.history);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingHistory(false);
  }

  useEffect(() => {
    if (submission.id) {
      fetchHistory();
    }
  }, [submission]);

  const colors = {
    "aprovou": "var(--success)",
    "rejeitou": "var(--danger)",
    "pré-aprovou": "var(--success-hover)",
    "submeteu": "var(--primary-color)",
    "editou": "var(--warning-hover)",
    "comentou": "var(--warning-hover)",
  };

  function SubmissionHistory() {
    return (
      <History>
        {fetchingHistory ? (
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        ) : (
          <>
            {history.map((item, index) => (
              <HistoryItem key={index} color={colors[item.action]}>
                <div>
                  <img
                    src={user?.profileImage && user?.profileImage.length > 0
                      ? user?.profileImage
                      : `${process.env.img}/user.png`
                    }
                    alt={user.name}
                    onError={({ currentTarget }) => {
                      currentTarget.src = `${process.env.img}/user.png`;
                    }}
                  />
                  <p>
                    <b>{getFirstAndLastName(item.user.name)}</b><UserRole style={{ marginRight: 5 }}>{UserTypes[item.user.userTypeId]}</UserRole>
                    <span style={{ color: colors[item.action] }}>{item.action}</span> a submissão em {parseDateAndTime(item.createdAt)}
                  </p>
                </div>

                {item.details && <p><span>Obs.:</span> {item.details}</p>}
              </HistoryItem>
            ))}
          </>
        )}
      </History>
    );
  }

  // Delete
  async function fetchDelete() {
    const options = {
      url: `${process.env.api}/submissions/${submission.id}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        onChange();
        toast.success("Submissão cancelada com sucesso.");
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });
  }

  return (
    <ButtonGroup>
      <InfoButton onClick={() =>
        toggleModalForm(
          "Histórico da submissão",
          <SubmissionHistory />,
          "lg"
        )
      }>
        <i className="bi bi-clock-history" /> Histórico
      </InfoButton>

      {[1, 2].includes(submission.status) && (
        <EditButton onClick={() =>
          toggleModalForm(
            "Editar submissão",
            <FormUpdateSubmission submission={submission} user={user} onChange={onChange} />,
            "lg"
          )
        }>
          <i className="bi bi-pencil" /> Editar
        </EditButton>
      )}

      {(user?.userTypeId == 1 && [1, 2].includes(submission.status)) && (
        <>
          <DangerButtonAlt
            onClick={() =>
              toggleModalForm(
                "Rejeitar submissão",
                <FormUpdateStatusSubmission submission={submission} user={user} onChange={onChange} status={"Rejeitado"} />,
                "md"
              )
            }>
            <i className="bi bi-x-lg" /> Rejeitar
          </DangerButtonAlt>

          <AcceptButton
            onClick={() =>
              toggleModalForm(
                "Aprovar submissão",
                <FormUpdateStatusSubmission submission={submission} user={user} onChange={onChange} status={"Aprovado"} />,
                "md"
              )
            }>
            <i className="bi bi-check2-all" /> Aprovar
          </AcceptButton>
        </>
      )}
      {(user?.userTypeId == 2 && [1].includes(submission.status)) && (
        <AcceptButton
          onClick={() =>
            toggleModalForm(
              "Pré-aprovar submissão",
              <FormUpdateStatusSubmission submission={submission} user={user} onChange={onChange} status={"Pré-aprovado"} />,
              "md"
            )
          }>
          <i className="bi bi-check2-all" /> Pré-aprovar
        </AcceptButton>
      )}
      {(user?.userTypeId == 3 && [1, 2].includes(submission.status)) && (
        <DangerButtonAlt
          onClick={() =>
            confirm(
              () => fetchDelete(),
              "Tem certeza que deseja cancelar a submissão?",
              "Cancelar",
              ""
            )
          }>
          <i className="bi bi-x-lg" /> Cancelar
        </DangerButtonAlt>
      )}
    </ButtonGroup >
  );
}