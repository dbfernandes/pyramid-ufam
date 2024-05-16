import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { validateEmail } from "utils";

// Shared
import Form from "components/shared/Form";
import { LinkWrapper, FormAlert } from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import TextAlert from "components/shared/TextAlert";

export default function FormForgotPassword() {
  const router = useRouter();

  // Inputs and validators
  const [email, setEmail] = useState<string>("");
  const handleEmail = value => {
    setEmail(value);
  }

  // Form login
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function handleSendLink(e) {
    e.preventDefault();
    setSent(true);

    if (validateEmail(email)) {
      fetchSendLink(email);
    }
  }

  async function fetchSendLink(_email) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/auth/password-reset-request/`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        email: _email
      }
    };

    await axios.request(options as AxiosRequestConfig).then(
      (response) => {
        setSuccess(true);

        setTimeout(() => {
          router.push("/entrar");
        }, 3000);
      }).catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          404: "Usuário não encontrado.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        setError(code in errorMessages ? errorMessages[code] : errorMessages[0]);
        setSuccess(false);
      });

    setFetching(false);
  }

  return (
    sent && success
      ? <TextAlert displayIcon={true}>
        Email enviado com sucesso. Você será redirecionado para a tela de Login.
      </TextAlert>
      : <Form title={"Esqueceu sua senha?"}>
        <p style={{ marginTop: "-20px" }}>
          Caso você tenha esquecido sua senha, basta digitar o <b>email</b> cadastrado na sua conta no campo abaixo e clicar em <b>Enviar</b>.
        </p>
        <p style={{ marginBottom: "20px" }}>
          O link para o formulário de alteração de senha será enviado para o email cadastrado e será válido por 1 hora.
        </p>

        <TextInput
          label={"Email"}
          name={"email"}
          value={email}
          handleValue={handleEmail}
          validate={validateEmail}
          required={true}
          alert={"Email inválido"}
          displayAlert={sent}
          maxLength={255}
        />

        <Button
          style={{ marginTop: 15 }}
          onClick={(e) => handleSendLink(e)}>
          {fetching
            ? <Spinner size={"20px"} color={"var(--white-1)"} />
            : <>
              <i className="fas fa-paper-plane"></i>
              Enviar link
            </>
          }
        </Button>

        <>
          {(sent && !success && error.length != 0) &&
            <FormAlert>
              {error}
            </FormAlert>
          }
        </>

        <LinkWrapper>
          <Link href="/entrar">
            <a>Voltar</a>
          </Link>
        </LinkWrapper>
      </Form>
  );
}