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

// Custom
import Activities from "components/pages/Atividades/Activities";

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

  // Activities
  const [activities, setActivities] = useState<any[]>([]);
  const [activityGroup, setActivityGroup] = useState<string>(router.query.group ? router.query.group as string : "");
  const [fetchingActivities, setFetchingActivities] = useState<boolean>(true);

  useEffect(() => {
    if (router.query) {
      setActivityGroup(router.query.group as string);
    }
  }, [router]);

  useEffect(() => {
    if (activityGroup && activityGroup in ActivityGroupsNames) {
      fetchActivities();

      // Setting links used in breadcrumb
      setLinks([
        {
          title: "Atividades",
        },
        {
          title: ActivityGroupsNames[activityGroup].title
        }
      ]);
    }
  }, [activityGroup]);

  // Fetching activities
  async function fetchActivities() {
    setFetchingActivities(true);

    const options = {
      url: `${process.env.api}/courses/${user.selectedCourse ? user.selectedCourse.id : ""}/${ActivityGroupsNames[activityGroup].slug}/activities`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
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

  return (
    <>
      <Head>
        <title>Atividades de {ActivityGroupsNames[activityGroup].title.toLowerCase()} - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          {fetchingActivities
            ? (
              <div
                style={{
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Spinner size={"30px"} color={"var(--primary-color)"} />
              </div>
            )
            : <Activities
              activities={activities}
              title={ActivityGroupsNames[activityGroup].title}
              groupSlug={ActivityGroupsNames[activityGroup].slug}
              onChange={fetchActivities}
            />
          }
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