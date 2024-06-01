import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { getImage, validateCpf, validateEmail } from "utils";
import { store } from "redux/store";
import { login, setProfileImage } from "redux/slicer/user";

// Shared
import { H5 } from "components/shared/Titles";
import { FormAlert } from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import toast from "components/shared/Toast";

// Custom
import { CustomForm, FormSection, ProfilePicture } from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";

interface IFormUpdateAccountProps {
  user: IUserLogged;
}

export default function FormUpdateAccount({ user }: IFormUpdateAccountProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fetchingUpdateImage, setFetchingUpdateImage] = useState<boolean>(false);
  const { dispatch } = store;

  useEffect(() => {
    if (user != null) {
      setName(user.name);
      setEmail(user.email);
      setCpf(user.cpf ? user.cpf : "");
    }
  }, [user]);

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setSent(true);
    if (name.length !== 0 && validateEmail(email) && (cpf.length === 0 || validateCpf(cpf))) {
      const data = { name, email, ...(cpf.trim().length > 0 && { cpf }) };
      fetchUpdateUser(data);
    }
  };

  const fetchUpdateUser = async (data) => {
    setFetching(true);
    const options: AxiosRequestConfig = {
      url: `${process.env.api}/users/${user?.id}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      data
    };
    try {
      const response = await axios.request(options);
      setSuccess(true);
      toast("Sucesso", "Informações atualizadas com sucesso.", "success");
      dispatch(login({
        ...user,
        name: response.data.name,
        email: response.data.email,
        cpf: response.data.cpf
      }));
    } catch (error) {
      handleError(error);
      setSuccess(false);
    }
    setFetching(false);
  };

  const handleImage = (e) => {
    const { files } = e.target;
    if (files.length > 0 && validateFile(files[0])) {
      fetchUpdateImage(files[0]);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 1000 * 1024;
    if (!file || !allowedTypes.includes(file.type) || file.size > maxSize) {
      toast("Erro", "Arquivo inválido", "danger");
      return false;
    }
    return true;
  };

  const fetchUpdateImage = async (file) => {
    setFetchingUpdateImage(true);
    const data = new FormData();
    data.append("file", file);
    const options: AxiosRequestConfig = {
      url: `${process.env.api}/users/${user?.id}/image`,
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${user.token}`
      },
      data
    };
    try {
      const response = await axios.request(options);
      dispatch(setProfileImage(response.data.user.profileImage));
      toast("Sucesso", "Imagem atualizada com sucesso.");
    } catch (error) {
      handleError(error);
    }
    setFetchingUpdateImage(false);
  };

  const handleError = (error) => {
    const errorMessages = {
      0: "Oops, tivemos um erro. Tente novamente.",
      400: error?.response?.data?.message || "Erro desconhecido",
      500: "Erro interno do servidor",
    };
    const code = error?.response?.status || 500;
    setError(errorMessages[code] || errorMessages[0]);
  };

  return (
    <CustomForm>
      <FormSection>
        <H5 style={{ marginBottom: 25 }}>Alterar informações pessoais</H5>
        {/*<ProfilePicture>
          <img src={getImage(user?.profileImage as string)} alt="Profile" />
          <div className="editImage">
            <label>
              <i className="bi bi-camera-fill" />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImage}
              />
            </label>
          </div>
  </ProfilePicture>*/}
        <TextInput
          label={"Nome completo*"}
          name={"name"}
          id={"name"}
          value={name}
          handleValue={setName}
          required={true}
          displayAlert={sent}
          maxLength={255}
        />
        <TextInput
          label={"Email*"}
          name={"email"}
          value={email}
          handleValue={setEmail}
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
          handleValue={setCpf}
          validate={validateCpf}
          alert={"CPF Inválido"}
          displayAlert={sent}
          mask={"999.999.999-99"}
        />
        <Button style={{ marginTop: 15 }} onClick={handleUpdateUser}>
          {fetching ? <Spinner size={"20px"} color={"var(--white-1)"} /> : "Atualizar"}
        </Button>
        {sent && !success && error && <FormAlert>{error}</FormAlert>}
      </FormSection>
    </CustomForm>
  );
}
