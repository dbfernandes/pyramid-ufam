import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

// Shared
import { ActivityGroupsNames } from "constants/activityGroups.constants";
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Atividades() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Verifying user
  useEffect(() => {
    if (!user.logged) {
      router.replace("/entrar");
    } else if (user.selectedCourse == null) {
      router.replace("/conta/curso");
    } else {
      setTimeout(() => setLoaded(true), 250);
    }
  }, [user]);

  // Activity
  const [activity, setActivity] = useState<any[]>([]);
  const [activityGroup, setActivityGroup] = useState<string>(router.query.group ? router.query.group as string : "");
  const [fetchingActivity, setFetchingActivity] = useState<boolean>(true);

  useEffect(() => {
    if (router.query) {
      setActivityGroup(router.query.group as string);
    }
  }, [router]);

  useEffect(() => {
    if (activityGroup && activityGroup in ActivityGroupsNames) {
      fetchActivity();

      // Setting links used in breadcrumb
      setLinks([
        {
          title: "Atividades",
        },
        {
          title: ActivityGroupsNames[activityGroup].title,
          route: "/atividades/" + activityGroup.toLowerCase()
        },
        {
          title: Array.isArray(activity) && activity.length > 0 ? activity[0]?.name : "Atividade"
        }
      ]);
    }
  }, [activityGroup, activity]);

  // Fetching activity
  async function fetchActivity() {
    setFetchingActivity(true);

    const options = {
      url: `${process.env.api}/activities/${router.query.id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setActivity(response.data);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingActivity(false);
  }

  return (
    <>
      <Head>
        <title>Atividades de {ActivityGroupsNames[activityGroup].title.toLowerCase()} - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          - Info da atividade<br />
          - Dashboard (n de alunos, n de submissões)<br />
          - Link pra submissões por atividade<br />
        </Wrapper>
      ) : (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context: any) {
  if (!(context.query.group as string in ActivityGroupsNames)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
}