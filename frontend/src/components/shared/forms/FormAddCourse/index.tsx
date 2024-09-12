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

interface IFormComponentProps {
  course?: any;
  onChange?: Function;
  handleCloseModalForm?: Function;
}

export default function FormAddCourse({
  course: courseProp = null,
  onChange = () => { },
  handleCloseModalForm,
}: IFormComponentProps) {
  const operation = courseProp == null ? "Adicionar" : "Editar";

  // Inputs and validators
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [periods, setPeriods] = useState<string>("");
  function validatePeriods(value) {
    const _value = parseInt(value);
    return !isNaN(_value) && _value > 0 && _value <= 16;
  }

  // Workloads
  const [minWorkload, setMinWorkload] = useState<string>("240");
  /*const [educationWorkload, setEducationWorkload] = useState<string>("240");
  const [researchWorkload, setResearchWorkload] = useState<string>("240");
  const [extensionWorkload, setExtensionWorkload] = useState<string>("240");*/

  function validateWorkload(value) {
    const _value = parseInt(value);
    return !isNaN(_value) && _value > 0 && _value <= 300;
  }

  // Loading course prop
  useEffect(() => {
    if (courseProp != null) {
      setName(courseProp.name);
      setCode(courseProp.code.toString());
      setPeriods(courseProp.periods.toString());
      setMinWorkload(courseProp.minWorkload.toString());

      const _education = courseProp.activityGroups.find((group) => group.name === "Ensino");
      const _research = courseProp.activityGroups.find((group) => group.name === "Pesquisa");
      const _extension = courseProp.activityGroups.find((group) => group.name === "Extensão");

      /*setEducationWorkload(_education.maxWorkload.toString());
      setResearchWorkload(_research.maxWorkload.toString());
      setExtensionWorkload(_extension.maxWorkload.toString());*/
    }
  }, [courseProp]);

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Add or Edit
  function handleAddCourse(e) {
    e.preventDefault();
    setSent(true);

    if (name.length > 0 &&
      code.length > 0 &&
      periods.length > 0 &&
      validatePeriods(periods) &&
      validateWorkload(minWorkload)/* &&
      validateWorkload(educationWorkload) &&
      validateWorkload(researchWorkload) &&
      validateWorkload(extensionWorkload)*/) {
      fetchAddCourse({
        name,
        code: code,
        periods: parseInt(periods),
        minWorkload: parseInt(minWorkload),
        /*activityGroupsWorkloads: {
          education: parseInt(educationWorkload),
          research: parseInt(researchWorkload),
          extension: parseInt(extensionWorkload)
        }*/
      }, operation === "Editar");
    }
  }

  async function fetchAddCourse(data, isEdit = false) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/courses${isEdit ? `/${courseProp.id}` : ""}`,
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
        toast.success(isEdit ? "Curso alterado com sucesso." : "Curso adicionado com sucesso.");
      })
      .catch((error) => {
        const badRequestMessages = {
          "Name already in use": "Nome já cadastrado.",
          "Code already in use": "Código já cadastrado.",
        };

        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          400: badRequestMessages[error?.response?.data?.message],
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
        <SectionTitle>
          <b>1.</b> Informações do curso
        </SectionTitle>

        <TextInput
          label={"Nome*"}
          name={"name"}
          value={name}
          handleValue={setName}
          required={true}
          displayAlert={sent}
          maxLength={100}
          showCharCount={true}
        />

        <MultiField>
          <TextInput
            label={"Código*"}
            name={"code"}
            value={code}
            handleValue={setCode}
            required={true}
            displayAlert={sent}
          />

          <TextInput
            label={"Períodos*"}
            name={"periods"}
            value={periods}
            handleValue={setPeriods}
            mask={"99"}
            validate={validatePeriods}
            required={true}
            displayAlert={sent}
          />
        </MultiField>

        <TextInput
          label={"Carga horária mínima (horas)*"}
          name={"minWorkoad"}
          value={minWorkload}
          handleValue={setMinWorkload}
          mask={"999"}
          validate={validateWorkload}
          required={true}
          displayAlert={sent}
        />

        {/* [Disabled] Workloads
          <SectionTitle>
            <b>2.</b> Carga horária por grupo de atividade (horas)
          </SectionTitle>

          <MultiField customGrid={"1fr 1fr 1fr"}>
            <TextInput
              label={"Educação*"}
              name={"educationWorkload"}
              value={educationWorkload}
              handleValue={setEducationWorkload}
              mask={"999"}
              validate={validateWorkload}
              required={true}
              displayAlert={sent}
            />

            <TextInput
              label={"Pesquisa*"}
              name={"researchWorkload"}
              value={researchWorkload}
              handleValue={setResearchWorkload}
              mask={"999"}
              validate={validateWorkload}
              required={true}
              displayAlert={sent}
            />

            <TextInput
              label={"Extensão*"}
              name={"extensionWorkload"}
              value={extensionWorkload}
              handleValue={setExtensionWorkload}
              mask={"999"}
              validate={validateWorkload}
              required={true}
              displayAlert={sent}
            />
          </MultiField>
         */}
      </div>

      <div style={{ width: "100%" }}>
        <>
          {sent && !success && error?.length !== 0 && (
            <FormAlert>{error}</FormAlert>
          )}
        </>

        <Button style={{ marginTop: 15 }} onClick={(e) => handleAddCourse(e)}>
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
