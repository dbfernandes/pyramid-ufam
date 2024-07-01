import { useEffect, useState } from "react";
import { getToken, slugify } from "utils";

// Custom
import ActivityCard from "components/shared/cards/ActivityCard";
import { CardGroup } from "../styles";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

// Interfaces
interface IActivityGroupsProps {
  link: string;
  grid?: string;
}

export default function ActivityGroups({
  link,
  grid
}: IActivityGroupsProps) {
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);

  useEffect(() => {
    fetchGroups();
  }, []);

  // Groups
  const [groups, setGroups] = useState<any[]>([]);
  const [fetchingGroups, setFetchingGroups] = useState<boolean>(true);
  async function fetchGroups() {
    setFetchingGroups(true);

    const options = {
      url: `${process.env.api}/courses/${user.selectedCourse?.id}`,
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

  return (
    <CardGroup grid={grid}>
      {groups.map((group) => (
        <ActivityCard
          key={group.id}
          user={user}
          link={`${link}${slugify(group.name)}`}
          activity={group}
          editable={false}
        />
      ))}
    </CardGroup>
  );
}