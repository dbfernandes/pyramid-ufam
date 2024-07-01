import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { getFilename, getToken } from "utils";

// Shared
import { FormAlert } from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import TextArea from "components/shared/TextArea";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import RangeInput from "components/shared/RangeInput";
import { toast } from "react-toastify";

// Custom
import ActivitySelect from "../ActivitySelect";
import FileDrop from "components/shared/FileDrop";
import { ParagraphTitle, RangeWrapper } from "../styles";

// Interfaces
import { IActivity } from "components/shared/cards/ActivityCard";
import IUserLogged from "interfaces/IUserLogged";
interface IFormComponentProps {
  user: IUserLogged;
  submission?: any;
  onChange?: Function;
  handleCloseModalForm?: Function;
}

export default function FormUpdateSubmission({
  user,
  submission: submissionProp = null,
  onChange = () => { },
  handleCloseModalForm,
}: IFormComponentProps) {
  // Inputs and validators
  const [details, setDetails] = useState<string>("");
  const handleDetails = (value) => {
    setDetails(value);
  };

  const [activeGroup, setActiveGroup] = useState<any | null>(null);
  const [activity, setActivity] = useState<IActivity | null>(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState<string>("");
  const handleDescription = (value) => {
    setDescription(value);
  };

  const [workload, setWorkload] = useState<number>(1);
  const handleWorkload = (value) => {
    setWorkload(value);
  };

  const handleFileSetFromUrl = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.blob();
      const metadata = { type: data.type };
      const file = new File([data], getFilename(url), metadata);

      setFile(file as any);
    } catch (error) {
      console.error("Error fetching file from URL:", error);
    }
  };

  // Loading submission prop
  useEffect(() => {
    if (submissionProp != null) {
      setActiveGroup(submissionProp.activity?.activityGroup);
      setActivity(submissionProp.activity);
      setDescription(submissionProp.description);
      setWorkload(submissionProp.workload);
      handleFileSetFromUrl(submissionProp.fileUrl);
    }
  }, [submissionProp]);

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);

    if (activity != null && description.length != 0 && file != null) {
      fetchSubmit();
    }
  }

  async function fetchSubmit() {
    setFetching(true);

    const data = new FormData();
    if (file !== null) {
      data.append("file", file);
    }
    if (activity !== null) {
      data.append("activityId", String(activity.id));
    }
    data.append("description", description);
    data.append("workload", String(workload));

    data.append("userId", String(user.id));
    data.append("details", details);

    const config: AxiosRequestConfig = {
      method: "PATCH",
      url: `${process.env.api}/submissions/${submissionProp.id}/`,
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${getToken()}`,
      },
      data: data,
    };

    await axios(config)
      .then((response) => {
        setSuccess(true);
        toast.success("Submissão atualizada com sucesso.");

        if (handleCloseModalForm) {
          handleCloseModalForm();
        }
        onChange();
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetching(false);
  }

  return (
    <div style={{ padding: "0 25px 25px" }}>
      <div style={{ width: "100%" }}>
        <ParagraphTitle style={{ marginTop: 0 }}>
          <b>(Opcional):</b> Alguma observação sobre o motivo da edição da submissão?
        </ParagraphTitle>

        <TextArea
          label={"Observações"}
          name={"details"}
          value={details}
          handleValue={handleDetails}
          displayAlert={sent}
          maxLength={255}
        />
      </div>

      <hr />

      <ActivitySelect
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
        activity={activity}
        setActivity={setActivity}
        user={user}
      />

      {activity != null && (
        <>
          <ParagraphTitle id="filedrop">
            Envie aqui o arquivo <b>(em PDF)</b> do seu certificado*
          </ParagraphTitle>
          <FileDrop
            file={file}
            setFile={setFile}
            required={true}
            maxSize={5000 * 1024}
            allowedTypes={["application/pdf"]}
            displayAlert={sent}
          />
          <ParagraphTitle>
            Descreva sua submissão (Exemplo:{" "}
            <i>Certificado Angular Seminfo 2023</i>)*
          </ParagraphTitle>
          <TextInput
            id="description"
            label={`Descrição*`}
            description={"description"}
            value={description}
            handleValue={handleDescription}
            required={true}
            displayAlert={sent}
            maxLength={255}
          />
          <ParagraphTitle>
            Quantas horas complementares você gostaria de solicitar?*
          </ParagraphTitle>

          <RangeWrapper>
            <RangeInput
              value={workload}
              handleValue={handleWorkload}
              min={1}
              max={activity.maxWorkload}
              disabled={activity == null}
            />
            <Button onClick={(e) => handleSubmit(e)}>
              {fetching ? (
                <Spinner size={"20px"} color={"var(--white-1)"} />
              ) : (
                <>
                  <i className="bi bi-check2-all" />
                  Editar
                </>
              )}
            </Button>
          </RangeWrapper>
        </>
      )}

      <>
        {sent && !success && error.length != 0 && (
          <FormAlert>{error}</FormAlert>
        )}
      </>
    </div>
  );
}
