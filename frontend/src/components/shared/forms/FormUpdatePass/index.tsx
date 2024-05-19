import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useDispatch } from "react-redux";
import { logout } from "redux/slicer/user";
import { useRouter } from "next/router";
import Link from "next/link";
import { getFirstName } from "utils";

// Shared
import Form from "components/shared/Form";
import { LinkWrapper, FormAlert } from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import TextAlert from "components/shared/TextAlert";

// Interface
interface IFormUpdatePassProps {
  tokenObj: any;
};

export default function FormUpdatePass({ tokenObj }: IFormUpdatePassProps) {
  const router = useRouter();

  // Inputs and validators
  const [password, setPassword] = useState<string>("");
  const handlePassword = value => {
    setPassword(value);
  }

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const handleConfirmPassword = value => {
    setConfirmPassword(value);
  }
  function validateConfirmPassword(value) {
    return value === password;
  }

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function handleUpdatePass(e) {
    e.preventDefault();
    setSent(true);

    if (password.length != 0
      && validateConfirmPassword(confirmPassword)) {
      fetchUpdatePass();
    }
  }

  const dispatch = useDispatch();
  async function fetchUpdatePass() {
    setSent(true);
    setFetching(true);

    const options = {
      url: `${process.env.api}/auth/password-reset/${tokenObj.resetToken}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        password: password
      }
    };

    await axios.request(options as AxiosRequestConfig).then(
      (response) => {
        setSuccess(true);
        dispatch(logout());

        setTimeout(() => {
          router.push("/entrar");
        }, 3000);
      }).catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
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
        Senha atualizada com sucesso. Você será redirecionado para a tela de Login.
      </TextAlert>
      : <Form title={"Redefinir senha"}>
        {tokenObj && <>
          <p style={{ marginTop: "-20px" }}>
            Olá, <b>{getFirstName(tokenObj?.name)}</b>. Para redefinir sua senha, basta digitar uma nova senha, confirmá-la e clicar em <b>Atualizar</b>.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Após isso, você será redirecionado para a página inicial.
          </p>
        </>}

        <TextInput
          type={"password"}
          label={"Senha*"}
          name={"password"}
          value={password}
          handleValue={handlePassword}
          required={true}
          displayAlert={sent}
          maxLength={255}
        />

        <TextInput
          type={"password"}
          label={"Confirmar senha*"}
          name={"confirmPassword"}
          value={confirmPassword}
          handleValue={handleConfirmPassword}
          validate={validateConfirmPassword}
          required={true}
          alert={"Senhas não conferem"}
          displayAlert={sent}
          maxLength={255}
        />

        <Button
          style={{ marginTop: 15 }}
          onClick={(e) => handleUpdatePass(e)}>
          {fetching
            ? <Spinner size={"20px"} color={"var(--black-1)"} />
            : <>
              <i className="fas fa-check"></i>
              Atualizar
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