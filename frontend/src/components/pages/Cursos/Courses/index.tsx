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

// Custom
import { CardGroup } from "../styles";
import CourseCard from "components/shared/cards/CourseCard";
import FormAddCourse from "components/shared/forms/FormAddCourse";

// Interfaces
import ICourse from "interfaces/ICourse";
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

interface ICoursesProps {
  courses: ICourse[];
  page: number;
  totalPages: number;
  search: string;
  setSearch: (search: string) => void;
  onChange?: Function;
}

export default function Courses({ courses, page, totalPages, search, setSearch, onChange = () => { } }: ICoursesProps) {
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const isMobile = useMediaQuery({ maxWidth: 992 });

  async function fetchDelete(id) {
    const options = {
      url: `${process.env.api}/courses/${id}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
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
      </HeaderWrapper>

      {courses?.length > 0 ?
        (<>
          <Filter>
            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar cursos" />
          </Filter>
          <CardGroup>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                link={`cursos/${course.id}`}
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

      {courses?.length > 0 && <Paginator page={page} totalPages={totalPages} />}

      {isMobile && (
        <FloatingMenu onClickAdd={() => { }} />
      )}
    </DefaultWrapper>
  );
}
