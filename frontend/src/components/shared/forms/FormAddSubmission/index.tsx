import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import { getToken } from "utils";

// Shared
import { FormAlert } from "components/shared/Form/styles";
import FormPage from "components/shared/FormPage";
import TextInput from "components/shared/TextInput";
import Spinner from "components/shared/Spinner";
import RangeInput from "components/shared/RangeInput";
import { toast } from "react-toastify";

// Custom
import ActivitySelect from "./ActivitySelect";
import FileDrop from "components/shared/FileDrop";
import { ParagraphTitle, RangeWrapper } from "./styles";

// Interfaces
import { IActivity } from "components/shared/cards/ActivityCard";
import IUserLogged from "interfaces/IUserLogged";
import { Button } from "components/shared/Button";

interface IFormComponentProps {
  user: IUserLogged;
}

export default function FormAddSubmission({
  user
}: IFormComponentProps) {
  const router = useRouter();

  // Inputs and validators
  const [activeGroup, setActiveGroup] = useState<any | null>(null);
  const [activity, setActivity] = useState<IActivity | null>(null);
  useEffect(() => {
    if (activity != null) {
      document
        .getElementById("filedrop")!
        .scrollIntoView({ behavior: "smooth" });
      // @ts-ignore
      setWorkload(activity.maxWorkload);
    }
  }, [activity]);

  const [file, setFile] = useState(null);
  useEffect(() => {
    if (file != null) {
      const el = document.getElementById("description");
      el!.scrollIntoView({ behavior: "smooth" });
      el!.focus();
    }
  }, [file]);

  const [description, setDescription] = useState<string>("");
  const handleDescription = (value) => {
    setDescription(value);
  };

  const [workload, setWorkload] = useState<number>(1);
  const handleWorkload = (value) => {
    setWorkload(value);
  };

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
    if (activity != null) {
      data.append("activityId", String(activity.id));
    }
    data.append("description", description);
    data.append("workload", String(workload));

    const config: AxiosRequestConfig = {
      method: "POST",
      url: `${process.env.api}/users/${user.id}/submit`,
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${getToken()}`,
      },
      data: data,
    };

    await axios(config)
      .then((response) => {
        setSuccess(true);
        toast.success("Submissão enviada com sucesso.");
        router.push("/minhas-solicitacoes");
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
      });

    setFetching(false);
  }

  return (
    <FormPage title="Nova submissão" fullscreen={true}>
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
                  Enviar
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
    </FormPage>
  );
}
