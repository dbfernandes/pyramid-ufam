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
import { CustomForm, FormSection } from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
interface IFormSendPasswordResetLinkProps {
  user: IUserLogged;
}

export default function FormSendPasswordResetLink({ user }: IFormSendPasswordResetLinkProps) {
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

  return (
    <CustomForm>
      <FormSection>
        <H5 style={{ marginBottom: 25 }}>Alterar senha</H5>

        <p style={{ marginBottom: "15px", color: "var(--muted)" }}>
          Caso você deseje alterar sua senha, basta clicar no botão abaixo para receber um link para o formulário de alteração de senha.
        </p>
        <p style={{ marginBottom: "35px", color: "var(--muted)" }}>
          O link para o formulário será enviado para o email cadastrado na sua conta e será válido por 1 hora.
        </p>

        <Button style={{ marginTop: 15 }} onClick={(e) => handleSendPasswordResetLink(e)}>
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
