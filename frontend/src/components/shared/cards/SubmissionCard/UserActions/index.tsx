import axios, { AxiosRequestConfig } from "axios";

// Shared
import toast from "components/shared/Toast";
import {
  ButtonGroup,
  AcceptButton,
  DangerButton
} from "../styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import { StatusSubmissions } from "constants/statusSubmissions.constants";
// import { ISubmission } from "interfaces/submission";

interface IUserActionsProps {
  submission: any; //ISubmission;
  user: IUserLogged;
  onDelete?: () => void;
  onUpdateStatus?: () => void;
}

export default function UserActions({
  submission,
  user,
  onDelete = () => { },
  onUpdateStatus = () => { }
}: IUserActionsProps) {
  async function fetchUpdateStatus({ userId, id, status }) {
    // setFetching(true);

    const options = {
      url: `${process.env.api}/submissions/${id}/status`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        userId,
        status: StatusSubmissions[status],
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        toast("Sucesso", "Status atualizado com sucesso.", "success");
        onUpdateStatus();
      })
      .catch((error) => {

        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast("Erro", code in errorMessages ? errorMessages[code] : errorMessages[0], "danger");
      });

    // setFetching(false);
  }

  return <>
    {user?.userTypeId == 1 && (
      <ButtonGroup>
        <DangerButton
          onClick={() =>
            fetchUpdateStatus({
              userId: user.id,
              id: submission.id,
              status: StatusSubmissions["Rejeitado"],
            })
          }>
          <i className="bi bi-x-lg" /> Rejeitar
        </DangerButton>

        <AcceptButton
          onClick={() =>
            fetchUpdateStatus({
              userId: user.id,
              id: submission.id,
              status: StatusSubmissions["Aprovado"],
            })
          }>
          <i className="bi bi-check2-all" /> Aprovar
        </AcceptButton>
      </ButtonGroup>
    )}
    {user?.userTypeId == 2 && (
      <ButtonGroup>
        <AcceptButton
          onClick={() =>
            fetchUpdateStatus({
              userId: user.id,
              id: submission.id,
              status: StatusSubmissions["Pré-aprovado"],
            })
          }>
          <i className="bi bi-check2-all" /> Pré-aprovar
        </AcceptButton>
      </ButtonGroup>
    )}
    {user?.userTypeId == 3 && (
      <ButtonGroup>
        <DangerButton
          onClick={() => {
            fetchUpdateStatus({
              userId: user.id,
              id: submission.id,
              status: StatusSubmissions["Cancelado"],
            })
          }}>
          <i className="bi bi-x-lg" /> Cancelar
        </DangerButton>
      </ButtonGroup>
    )}
  </>
}