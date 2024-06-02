import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import TextAlert from "components/shared/TextAlert";
import { LinkWrapper } from "components/shared/Form/styles";
import Form from "components/shared/Form";

// Custom
import FormUpdatePass from "components/shared/forms/FormUpdatePass";
import FormForgotPassword from "components/shared/forms/FormForgotPassword";

export default function Senha() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [tokenObj, setTokenObj] = useState<any>(null);
  async function fetchToken(token) {
    const options = {
      url: `${process.env.api}/auth/password-reset/${token}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };

    await axios.request(options as AxiosRequestConfig).then(
      (response) => {
        setTokenObj(response.data);
      }).catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          404: "Token inválido ou expirado. Solicite um novo link de redefinição de senha.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        setError(code in errorMessages ? errorMessages[code] : errorMessages[0]);
        setSuccess(false);
      });

    setLoaded(true);
  }

  useEffect(() => {
    const { token } = router?.query;

    if (!tokenObj) {
      fetchToken(token ? token : "");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{loaded && `${router?.query?.token ? "Redefinir senha" : "Esqueci minha senha"} - `}{process.env.title}</title>
      </Head>

      {loaded
        ? <Wrapper centerAlign={true}>
          {router?.query?.token
            ? tokenObj
              ? <FormUpdatePass tokenObj={tokenObj} />
              : <TextAlert
                displayIcon={true}
                type={"error"}
                link={"/entrar"}>
                {error}
              </TextAlert>
            : <FormForgotPassword />
          }
        </Wrapper>
        : <div style={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      }
    </>
  );
}