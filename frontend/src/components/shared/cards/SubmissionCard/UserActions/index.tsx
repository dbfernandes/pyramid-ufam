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
  AcceptButton,
  DangerButtonAlt,
  InfoButton,
  EditButton,
  ButtonGroupBottom
} from "../styles";

// Custom
import { History, HistoryItem } from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import { UserRole } from "components/shared/Header/UserInfo/styles";
import { UserTypes } from "constants/userTypes.constants";

interface IUserActionsProps {
  submission: any; //ISubmission;
  userLogged: IUserLogged;
  onChange?: Function;
}

export default function UserActions({
  submission,
  userLogged,
  onChange = () => { }
}: IUserActionsProps) {
  // History
  const [fetchingHistory, setFetchingHistory] = useState<boolean>(true);
  const [history, setHistory] = useState<any[]>([]);

  const [details, setDetails] = useState<string>("");

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
                    src={item?.user?.profileImage && item?.user?.profileImage.length > 0
                      ? item?.user?.profileImage
                      : `${process.env.img}/user.png`
                    }
                    alt={item?.user?.name}
                    onError={({ currentTarget }) => {
                      currentTarget.src = `${process.env.img}/user.png`;
                    }}
                  />
                  <p>
                    <b>{getFirstAndLastName(item?.user?.name)}</b><UserRole style={{ marginRight: 5 }}>{UserTypes[item?.user?.userTypeId]}</UserRole>
                    <span style={{ color: colors[item?.action] }}>{item?.action}</span> a submissão em {parseDateAndTime(item?.createdAt)}
                  </p>
                </div>

                {item?.details && <p><span>Obs.:</span> {item?.details}</p>}
              </HistoryItem>
            ))}
          </>
        )}
      </History>
    );
  }

  async function fetchUpdateStatusAndDelete() {
    setFetching(true);

    const updateStatusOptions = {
      url: `${process.env.api}/submissions/${submission.id}/status`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      data: {
        status: "Cancelado",
      },
    };

    try {
      await axios.request(updateStatusOptions as AxiosRequestConfig);
      toast.success("Status atualizado para Cancelado com sucesso.");
      onChange();
      
    } catch (error) {
      console.log(updateStatusOptions)
      console.log(submission)
      const errorMessages = {
        0: "Oops, tivemos um erro. Tente novamente.",
      };

      toast.error(errorMessages[0]);
    } finally {
      setFetching(false);
    }
  }

  return (
    <ButtonGroupBottom>
      <InfoButton onClick={() =>
        toggleModalForm(
          "Histórico da submissão",
          <SubmissionHistory />,
          "lg"
        )
      }>
        <i className="bi bi-clock-history" />
        <span>Histórico</span>
      </InfoButton>

      {[1, 2, 3, 4].includes(submission.status) && (
        <EditButton onClick={() =>
          toggleModalForm(
            "Editar submissão",
            <FormUpdateSubmission submission={submission} userLogged={userLogged} onChange={onChange} />,
            "lg"
          )
        }>
          <i className="bi bi-pencil" />
          <span>Editar</span>
        </EditButton>
      )}

      {(userLogged?.userTypeId == 1 && [1, 2, 3].includes(submission.status)) && (
        <>
          <DangerButtonAlt
            onClick={() =>
              toggleModalForm(
                "Rejeitar submissão",
                <FormUpdateStatusSubmission submission={submission} onChange={onChange} status={"Rejeitado"} />,
                "md"
              )
            }>
            <i className="bi bi-x-lg" />
            <span>Rejeitar</span>
          </DangerButtonAlt>
        </>
        )}
      {(userLogged?.userTypeId == 1 && [1, 2, 4].includes(submission.status)) && (
        <>
          <AcceptButton
            onClick={() =>
              toggleModalForm(
                "Aprovar submissão",
                <FormUpdateStatusSubmission submission={submission} onChange={onChange} status={"Aprovado"} />,
                "md"
              )
            }>
            <i className="bi bi-check2-all" />
            <span>Aprovar</span>
          </AcceptButton>
        </>

      )}
      {(userLogged?.userTypeId == 2 && [1].includes(submission.status)) && (
        <AcceptButton
          onClick={() =>
            toggleModalForm(
              "Pré-aprovar submissão",
              <FormUpdateStatusSubmission submission={submission} onChange={onChange} status={"Pré-aprovado"} />,
              "md"
            )
          }>
          <i className="bi bi-check2-all" />
          <span>Pré-aprovar</span>
        </AcceptButton>
      )}
      {(userLogged?.userTypeId == 3 && [1, 2, 4].includes(submission.status)) && (
        <DangerButtonAlt
          onClick={() =>
            confirm(
              () => fetchUpdateStatusAndDelete(),
              "Tem certeza que deseja cancelar a submissão?",
              "Cancelar",
              ""
            )
          }>
          <i className="bi bi-x-lg" />
          <span>Cancelar</span>
        </DangerButtonAlt>
      )}
    </ButtonGroupBottom >
  );
}
