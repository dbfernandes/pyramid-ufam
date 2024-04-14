import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios, { AxiosRequestConfig } from "axios";

// Shared
import { H3 } from "components/shared/Titles";
import toggleModalForm from "components/shared/ModalForm";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import { AddUserButton, Filter, HeaderWrapper } from "components/shared/UserList/styles";
import SearchBar from "components/shared/SearchBar";
import { Disclaimer } from "components/shared/UserList/styles";
import Paginator from "components/shared/Paginator";
import { useMediaQuery } from "react-responsive";
import FloatingMenu from "components/shared/FloatingMenu";
import toast from "components/shared/Toast";
import Spinner from "components/shared/Spinner";

// Custom
import { CardGroup } from "./styles";
import CourseCard from "components/shared/cards/CourseCard";
import FormAddCourse from "components/shared/forms/FormAddCourse";

// Interfaces
import ICourse from "interfaces/ICourse";
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import Button, { ReloadButton } from "components/shared/Button";
import { useState } from "react";

interface ICoursesProps {
  courses: ICourse[];
  loading: boolean;
  totalPages: number;

  onChange?: Function;
}

export default function Courses({
  courses,
  loading,
  totalPages,

  onChange = () => { }
}: ICoursesProps) {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const isMobile = useMediaQuery({ maxWidth: 992 });
  const [isReloading, setIsReloading] = useState(false);

  async function handleReload() {
    setIsReloading(true);

    try {
      const response = await axios.get(`${process.env.api}/courses`);
      onChange(response.data);
      setIsReloading(false);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      setIsReloading(false);
    }
  }


  async function fetchDelete(id) {
    const options = {
      url: `${process.env.api}/courses/${id}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        onChange();
        toast("Sucesso", "Curso removido com sucesso");
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast("Erro", code in errorMessages ? errorMessages[code] : errorMessages[0], "danger");
      });
  }

  return (
    <DefaultWrapper>
      <HeaderWrapper>
        <H3>Cursos</H3>

        {!isMobile && (
          <AddUserButton onClick={() =>
            toggleModalForm(
              "Adicionar curso",
              <FormAddCourse user={user} onChange={onChange} />,
              "md"
            )}>
            <i className={`bi bi-mortarboard-fill`}>
              <i className="bi bi-plus" />
            </i>
            Adicionar curso
          </AddUserButton>
        )}

        <ReloadButton onClick={handleReload} disabled={isReloading}>
          {isReloading ? (
            <Spinner size={"16px"} color={"var(--primary-color)"} />
            ) : (
              <i className="bi bi-arrow-clockwise"></i>
              )}
        </ReloadButton>

      </HeaderWrapper>

      <Filter>
        <SearchBar
          placeholder="Pesquisar cursos" />
      </Filter>



      {loading
        ? <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
        : courses?.length > 0 ?
          (<>
            <CardGroup>
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  // link={`cursos/${course.id}`} 
                  course={course}
                  editable={true}
                  onDelete={() => fetchDelete(course.id)}
                  onChange={onChange}
                />
              ))}
            </CardGroup>
          </>)
          : (<Disclaimer>Não há cursos cadastrados.</Disclaimer>)
      }

      {courses?.length > 0 && <Paginator page={parseInt(router.query.page as string)} totalPages={totalPages} />}

      {/*isMobile && (
        <FloatingMenu onClickAdd={() => { }} />
      )*/}
    </DefaultWrapper>
  );
}
