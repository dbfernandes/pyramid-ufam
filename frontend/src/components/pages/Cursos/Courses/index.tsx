import { useRouter } from "next/router";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "utils";

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
import { toast } from "react-toastify";
import Spinner from "components/shared/Spinner";

// Custom
import { CardGroup } from "./styles";
import CourseCard from "components/shared/cards/CourseCard";
import FormAddCourse from "components/shared/forms/FormAddCourse";

// Interfaces
import ICourse from "interfaces/ICourse";
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
  const isMobile = useMediaQuery({ maxWidth: 992 });

  async function fetchDelete(id) {
    const options = {
      url: `${process.env.api}/courses/${id}`,
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
        <H3>Cursos</H3>

        {!isMobile && (
          <AddUserButton onClick={() =>
            toggleModalForm(
              "Adicionar curso",
              <FormAddCourse onChange={onChange} />,
              "md"
            )}>
            <i className={`bi bi-mortarboard-fill`}>
              <i className="bi bi-plus" />
            </i>
            Adicionar curso
          </AddUserButton>
        )}


      </HeaderWrapper>

      <Filter>
        <SearchBar placeholder="Pesquisar cursos" />
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
          : (<Disclaimer>Nenhum curso encontrado.</Disclaimer>)
      }

      {courses?.length > 0 && <Paginator page={parseInt(router.query.page as string)} totalPages={totalPages} />}

      {/*isMobile && (
        <FloatingMenu onClickAdd={() => { }} />
      )*/}
    </DefaultWrapper>
  );
}
