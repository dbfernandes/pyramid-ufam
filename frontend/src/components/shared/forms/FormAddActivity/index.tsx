import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "utils";

// Shared
import { MultiField, FormAlert, SectionTitle } from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import Content from "components/shared/ModalForm/Content";
import { toast } from "react-toastify";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import TextArea from "components/shared/TextArea";

interface IFormComponentProps {
  activity?: any;
  userLogged: IUserLogged;
  groupSlug: string;
  onChange?: Function;
  handleCloseModalForm?: Function;
}

export default function FormAddActivity({
  activity: activityProp = null,
  userLogged,
  groupSlug,
  onChange = () => { },
  handleCloseModalForm,
}: IFormComponentProps) {
  const operation = activityProp == null ? "Adicionar" : "Editar";

  // Inputs and validators
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [maxWorkload, setMaxWorkload] = useState<string>("240");
  function validateWorkload(value) {
    const _value = parseInt(value);
    return !isNaN(_value) && _value > 0 && _value <= 300;
  }

  // Loading activity prop
  useEffect(() => {
    if (activityProp != null) {
      setName(activityProp.name);
      setDescription(activityProp.description);
      setMaxWorkload(activityProp.maxWorkload.toString());
    }
  }, [activityProp]);

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Add or Edit
  function handleAddActivity(e) {
    e.preventDefault();
    setSent(true);

    if (name.length > 0 &&
      validateWorkload(maxWorkload)) {
      fetchAddActivity({
        name,
        description,
        maxWorkload: parseInt(maxWorkload),
      }, operation === "Editar");
    }
  }

  async function fetchAddActivity(data, isEdit = false) {
    setFetching(true);

    const options = {
      url: isEdit
        ? `${process.env.api}/activities/${activityProp ? activityProp.id : ""}`
        : `${process.env.api}/courses/${userLogged?.selectedCourse ? userLogged?.selectedCourse?.id : ""}/${groupSlug}/activities`,
      method: isEdit ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      data: data,
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setSuccess(true);
        onChange();
        if (handleCloseModalForm) {
          handleCloseModalForm();
        }
        toast.success(isEdit ? "Atividade alterada com sucesso." : "Atividade adicionada com sucesso.");
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        setError(
          code in errorMessages ? errorMessages[code] : errorMessages[0]
        );
        setSuccess(false);
        setFetching(false);
      });
  }

  return (
    <Content>
      <div style={{ width: "100%" }}>
        <TextInput
          label={"Nome*"}
          name={"name"}
          value={name}
          handleValue={setName}
          required={true}
          displayAlert={sent} 
          maxLength={255}
          showCharCount={true}
        />

        <TextInput
          label={"Carga horária máxima*"}
          name={"maxWorkload"}
          value={maxWorkload}
          handleValue={setMaxWorkload}
          required={true}
          displayAlert={sent}       
        />

        <TextArea
          label={"Descrição"}
          name={"description"}
          value={description}
          handleValue={setDescription}
          displayAlert={sent}
          maxLength={255}
        />
      </div>

      <div style={{ width: "100%" }}>
        <>
          {sent && !success && error?.length !== 0 && (
            <FormAlert>{error}</FormAlert>
          )}
        </>

        <Button style={{ marginTop: 15 }} onClick={(e) => handleAddActivity(e)}>
          {fetching ? (
            <Spinner size={"20px"} color={"var(--white-1)"} />
          ) : (
            <>
              <i className="bi bi-check2-all" />
              {operation}
            </>
          )}
        </Button>
      </div>
    </Content>
  );
}
