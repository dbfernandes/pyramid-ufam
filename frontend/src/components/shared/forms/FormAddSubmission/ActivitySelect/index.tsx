import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { getToken, slugify } from "utils";

// Shared
import { ActivityGroupsNames } from "constants/activityGroups.constants";
import Spinner from "components/shared/Spinner";
import { Disclaimer } from "components/shared/UserList/styles";
import ActivityCard from "components/shared/cards/ActivityCard";

// Custom
import {
  Wrapper,
  CardGroup
} from "./styles";

// Interfaces
import { IActivity } from "components/shared/cards/ActivityCard";
import IUserLogged from "interfaces/IUserLogged";

interface IActivitySelectProps {
  activeGroup: any;
  setActiveGroup: React.Dispatch<React.SetStateAction<any | null>>;
  activity: IActivity | null;
  setActivity: React.Dispatch<React.SetStateAction<IActivity | null>>;
  user: IUserLogged;
}

export default function ActivitySelect({
  activeGroup,
  setActiveGroup,
  activity,
  setActivity,
  user,
}: IActivitySelectProps) {
  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (activeGroup != null) {
      fetchActivities();
    }
  }, [activeGroup]);

  // Groups
  const [groups, setGroups] = useState<any[]>([]);
  const [fetchingGroups, setFetchingGroups] = useState<boolean>(true);
  async function fetchGroups() {
    setFetchingGroups(true);

    const options = {
      url: `${process.env.api}/courses/${user?.selectedCourse?.id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setGroups(response.data.activityGroups);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingGroups(false);
  }

  // Activities
  const [activities, setActivities] = useState<any[]>([]);
  const [fetchingActivities, setFetchingActivities] = useState<boolean>(false);
  async function fetchActivities() {
    setFetchingActivities(true);

    const options = {
      url: `${process.env.api}/courses/${user.selectedCourse ? user.selectedCourse.id : ""}/${ActivityGroupsNames[slugify(activeGroup.name)].slug}/activities`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingActivities(false);
  }

  useEffect(() => {
    if (activities.length > 0)
      document
        .getElementById("activities")!
        .scrollIntoView({ behavior: "smooth" });
  }, [activities]);

  return (
    <Wrapper>
      <p style={{ color: "var(--muted)", marginBottom: "10px" }}>Em qual grupo sua atividade se enquadra?</p>

      {fetchingGroups
        ? <Spinner size={"20px"} color={"var(--primary-color)"} />
        : groups.length > 0
          ? <CardGroup>
            {groups.map((group) => (
              <ActivityCard
                key={group.id}
                activity={group}
                user={user}
                editable={false}
                onClick={() => {
                  setActiveGroup(group);
                  setActivity(null);
                }}
                marked={activeGroup && (activeGroup.name == group.name)}
                blurred={activeGroup && (activeGroup.name != group.name)}
              />
            ))}
          </CardGroup>
          : <Disclaimer>Nenhum grupo de atividades vinculados à este curso foi encontrado.</Disclaimer>
      }

      {
        fetchingActivities
          ? <div style={{ marginTop: 30 }}><Spinner size={"20px"} color={"var(--primary-color)"} /></div>
          : activities.length > 0
            ? (
              <>
                <p style={{ color: "var(--muted)", marginBottom: "10px" }} id="activities">Sua submissão é para qual tipo de atividade?</p>

                <CardGroup>
                  {activities?.map((_activity, index) => (
                    <ActivityCard
                      key={index}
                      activity={_activity}
                      user={user}
                      editable={false}
                      onClick={() => setActivity(_activity)}
                      marked={activity != null && _activity.name == activity.name}
                      blurred={activity != null && _activity.name != activity.name}
                    />
                  ))}
                </CardGroup>
              </>
            )
            : activeGroup && <Disclaimer>Nenhuma atividade desde grupo de atividade (para este curso) foi encontrada.</Disclaimer>
      }
    </Wrapper >
  );
}