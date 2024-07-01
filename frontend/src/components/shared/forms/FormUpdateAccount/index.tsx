import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { getToken, validateCpf, validateEmail } from "utils";

import { store } from "redux/store";
import { login, setProfileImage } from "redux/slicer/user";

// Shared
import { H5 } from "components/shared/Titles";
import {
  FormAlert
} from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import Spinner from "components/shared/Spinner";
import { toast } from "react-toastify";

// Custom
import { CustomForm, FormSection, ProfilePicture } from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import { Button } from "components/shared/Button";
interface IFormUpdateAccountProps {
  user: IUserLogged;
}

export default function FormUpdateAccount({ user }: IFormUpdateAccountProps) {
  const [name, setName] = useState<string>("");
  const handleName = (value) => {
    setName(value);
  };

  const [email, setEmail] = useState<string>("");
  const handleEmail = (value) => {
    setEmail(value);
  };

  const [cpf, setCpf] = useState<string>("");
  const handleCpf = (value) => {
    setCpf(value);
  };

  // Loading user prop
  useEffect(() => {
    if (user != null) {
      setName(user.name);
      setEmail(user.email);
      setCpf(user.cpf ? user.cpf : "");
    }
  }, [user]);

  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function handleUpdateUser(e) {
    e.preventDefault();
    setSent(true);

    if (
      name.length != 0 &&
      validateEmail(email) &&
      (cpf.length == 0 || validateCpf(cpf))
    ) {
      let data: any = {
        name,
        email
      };

      if (cpf.trim().length > 0 && validateCpf(cpf)) data = { ...data, cpf };

      fetchUpdateUser(data);
    }
  }

  async function fetchUpdateUser(data) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/users/${user?.id}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      data: data,
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setSuccess(true);
        toast.success("Informações atualizadas com sucesso.");
        dispatch(login({
          ...user,
          name: response.data.name,
          email: response.data.email,
          cpf: response.data.cpf
        }));
      })
      .catch((error) => {
        const badRequestMessages = {
          "Email already in use": "Email já cadastrado.",
          "CPF already in use": "CPF já cadastrado.",
        };

        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          400: badRequestMessages[error?.response?.data?.message],
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

  const [fetchingUpdateImage, setFetchingUpdateImage] = useState<boolean>(false);
  const handleImage = e => {
    function validateFile(file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 3000 * 1024;

      if (file == null) return false;
      if (!allowedTypes.includes(file.type)) {
        toast.error("Somente arquivos de imagem (.png, .jpg, .jpeg) são permitidos.");
        return false;
      } else if (maxSize != -1 && file.size > maxSize) {
        toast.error("Somente arquivos até 3 mb são permitidos.");
        return false;
      }

      return true;
    }

    const { files } = e.target;

    if (files.length > 0 && validateFile(files[0])) {
      fetchUpdateImage(files[0]);
    }
  }

  const { dispatch } = store;
  async function fetchUpdateImage(file) {
    setFetchingUpdateImage(true);

    const data = new FormData();
    if (file !== null) {
      data.append("file", file);
    }
    const options = {
      url: `${process.env.api}/users/${user?.id}/image`,
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${getToken()}`
      },
      data: data
    };

    await axios.request(options as AxiosRequestConfig).then(
      (response) => {
        dispatch(setProfileImage(response.data.profileImage));

        toast.success("Imagem atualizada com sucesso.");
      }).catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          400: error?.response?.data?.message
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingUpdateImage(false);
  }

  return (
    <CustomForm>
      <FormSection>
        <H5 style={{ marginBottom: 25 }}>Alterar informações pessoais</H5>

        <ProfilePicture>
          <img
            src={user?.profileImage && user?.profileImage.length > 0
              ? user?.profileImage
              : `${process.env.basePath}/img/user.png`
            }
            alt={user?.name}
            onError={({ currentTarget }) => {
              currentTarget.src = `${process.env.basePath}/img/user.png`;
            }}
          />

          <div className="editImage">
            <label>
              <i className="bi bi-camera-fill" />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImage(e)}
              />
            </label>
          </div>
        </ProfilePicture>

        <TextInput
          label={"Nome completo*"}
          name={"name"}
          id={"name"}
          value={name}
          handleValue={handleName}
          required={true}
          displayAlert={sent}
          maxLength={255}
        />

        <TextInput
          label={"Email*"}
          name={"email"}
          value={email}
          handleValue={handleEmail}
          validate={validateEmail}
          required={true}
          alert={"Email inválido"}
          displayAlert={sent}
          maxLength={255}
        />

        <TextInput
          label={"CPF"}
          name={"cpf"}
          value={cpf}
          handleValue={handleCpf}
          validate={validateCpf}
          alert={"CPF Inválido"}
          displayAlert={sent}
          mask={"999.999.999-99"}
        />

        <Button style={{ marginTop: 15 }} onClick={(e) => handleUpdateUser(e)}>
          {fetching ? (
            <Spinner size={"20px"} color={"var(--white-1)"} />
          ) : (
            <>
              <i className="bi bi-check2-all" />
              Atualizar
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
