import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";


// Shared
import { H5 } from "components/shared/Titles";
import {
  FormAlert
} from "components/shared/Form/styles";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import { toast } from "react-toastify";

// Custom
import { CustomForm, FormSection, ModalForm } from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import IUser from "interfaces/IUser";
interface IFormSendPasswordResetLinkProps {
  user: IUserLogged | IUser;
  handleCloseModalForm?: Function;
}

export default function FormSendPasswordResetLink({
  user,
  handleCloseModalForm,
}: IFormSendPasswordResetLinkProps) {
  const isOwnUser = "logged" in user;

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function handleSendPasswordResetLink(e) {
    e.preventDefault();
    fetchSendPasswordResetLink(user.email);
  }

  async function fetchSendPasswordResetLink(email) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/auth/password-reset-request/`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setSuccess(true);
        if (handleCloseModalForm) {
          handleCloseModalForm();
        }
        toast.success("Email enviado com sucesso.");
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          403: "Recurso não disponível",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        setError(
          code in errorMessages ? errorMessages[code] : errorMessages[0]
        );

        setSuccess(false);
      });

    setFetching(false);
  }

  const description = [
    [
      "Caso você deseje alterar a senha do usuário, basta clicar no botão abaixo para enviar um link para o formulário de alteração de senha.",
      "O link para o formulário será enviado para o email cadastrado na conta do usuário e será válido por 1 hora."
    ],
    [
      "Caso você deseje alterar sua senha, basta clicar no botão abaixo para receber um link para o formulário de alteração de senha.",
      "O link para o formulário será enviado para o email cadastrado na sua conta e será válido por 1 hora."
    ]
  ]

  return (
    <CustomForm style={!isOwnUser ? { padding: "0 30px 30px", maxWidth: "100%" } : {}}>
      <FormSection style={!isOwnUser ? { margin: 0 } : {}}>
        {isOwnUser && <H5 style={{ marginBottom: 25 }}>Alterar senha</H5>}

        {description[isOwnUser ? 1 : 0].map((text, index) => (<p key={index}>{text}</p>))}

        <Button style={{ marginTop: 15 }} onClick={(e) => handleSendPasswordResetLink(e)} disabled={fetching}>
          {fetching ? (
            <Spinner size={"20px"} color={"var(--white-1)"} />
          ) : (
            <>
              <i className="bi bi-check2-all" />
              Enviar link
            </>
          )}
        </Button>

        <>
          {sent && !success && error?.length != 0 && (
            <FormAlert>{error}</FormAlert>
          )}
        </>
      </FormSection>
    </CustomForm>
  );
}
