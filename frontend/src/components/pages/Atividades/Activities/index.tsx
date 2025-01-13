import { getToken, slugify } from "utils";
import { GroupIcons } from "constants/groupIcons.constants.";
import { useSelector } from "react-redux";
import axios, { AxiosRequestConfig } from "axios";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

// Shared
import AddResourceButton from "components/shared/AddResourceButton";
import CardGroup from "components/shared/CardGroup";
import { H3 } from "components/shared/Titles";
import toggleModalForm from "components/shared/ModalForm";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import { HeaderWrapper } from "components/shared/UserList/styles";
import { Disclaimer } from "components/shared/UserList/styles";
import ActivityCard from "components/shared/cards/ActivityCard";
import FormAddActivity from "components/shared/forms/FormAddActivity";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

interface IActivitiesProps {
  activities: any[];
  title: string;
  groupSlug: string;
  onChange?: Function;
}

export default function Activities({ activities, title, groupSlug, onChange = () => { } }: IActivitiesProps) {
  const userLogged = useSelector<IRootState, IUserLogged>((state) => state.user);
  const isMobile = useMediaQuery({ maxWidth: 575 });

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

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  const onDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData("draggedIndex");
    const newActivities = [...activities];
    const draggedItem = newActivities[draggedIndex];
    newActivities.splice(draggedIndex, 1);
    newActivities.splice(index, 0, draggedItem);

    onChange(newActivities); // Atualiza a lista após o arraste
  };

  const onDragOver = (e) => {
    e.preventDefault(); // Permite o drop
  };

  function AddActivityButton() {
    return (
      <AddResourceButton onClick={() =>
        toggleModalForm(
          `Adicionar atividade (${title})`,
          <FormAddActivity userLogged={userLogged} groupSlug={groupSlug} onChange={onChange} />,
          "md"
        )}>
        <i className={`bi bi-${GroupIcons[title]}`}>
          <i className="bi bi-plus" />
        </i>
        Adicionar atividade de {title.toLowerCase()}
      </AddResourceButton>
    );
  }

  return (
    <DefaultWrapper>
      <HeaderWrapper>
        <H3>Atividades de {title.toLowerCase()}</H3>

        {!isMobile && userLogged.userTypeId == 1 && <AddActivityButton />}
      </HeaderWrapper>

      {isMobile && userLogged.userTypeId == 1 && <AddActivityButton />}

      {activities?.length > 0 ?
        (<CardGroup>
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              // link={`/atividades/${slugify(title)}/${activity.id}`}
              activity={activity}
              userLogged={userLogged}
              groupSlug={groupSlug}
              editable={true}
              onDelete={() => fetchDelete(activity.id)}
              onChange={onChange}
            />
          ))}
        </CardGroup>)
        : (<Disclaimer>Nenhuma atividade deste grupo de atividade (para este curso) foi encontrada.</Disclaimer>)
      }
    </DefaultWrapper>
  );
}
