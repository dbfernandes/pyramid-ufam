import { getToken, slugify } from "utils";
import { GroupIcons } from "constants/groupIcons.constants.";
import { useSelector } from "react-redux";
import axios, { AxiosRequestConfig } from "axios";

// Shared
import { H3 } from "components/shared/Titles";
import toggleModalForm from "components/shared/ModalForm";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import { AddUserButton, HeaderWrapper } from "components/shared/UserList/styles";
import { Disclaimer } from "components/shared/UserList/styles";
import ActivityCard from "components/shared/cards/ActivityCard";
import { toast } from "react-toastify";
import FormAddActivity from "components/shared/forms/FormAddActivity";

// Custom
import { CardGroup } from "../styles";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
// import IActivity from "interfaces/IActivity";

interface IActivitiesProps {
  activities: any[];
  title: string;
  groupSlug: string;
  onChange?: Function;
}

export default function Activities({ activities, title, groupSlug, onChange = () => { } }: IActivitiesProps) {
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);

  async function fetchDelete(id) {
    const options = {
      url: `${process.env.api}/activities/${id}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        onChange();
        toast.success("Curso removido com sucesso.");
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });
  }

  return (
    <DefaultWrapper>
      <HeaderWrapper>
        {title === "Extensão" ? <H3>Atividades de extensão</H3> : <H3>Atividades de {title.toLowerCase()}</H3>}


        <AddUserButton onClick={() =>
          toggleModalForm(
            `Adicionar atividade (${title})`,
            <FormAddActivity user={user} groupSlug={groupSlug} onChange={onChange} />,
            "md"
          )}>
          <i className={`bi bi-${GroupIcons[title]}`}>
            <i className="bi bi-plus" />
          </i>
          Adicionar atividade
        </AddUserButton>
      </HeaderWrapper>

      {activities?.length > 0 ?
        (<CardGroup>
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              // link={`/atividades/${slugify(title)}/${activity.id}`}
              activity={activity}
              user={user}
              groupSlug={groupSlug}
              editable={true}
              onDelete={() => fetchDelete(activity.id)}
              onChange={onChange}
            />
          ))}
        </CardGroup>)
        : (<Disclaimer>Nenhuma atividade encontrada.</Disclaimer>)
      }
    </DefaultWrapper>
  );
}
