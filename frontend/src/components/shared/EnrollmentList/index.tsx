import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { setCourses } from "redux/slicer/user";
import { store } from "redux/store";
import { getToken } from "utils";

// Shared
import { H5 } from "../Titles";
import toggleModalForm from "components/shared/ModalForm";
import { CustomForm } from "../Form/styles";
import FormLinkCourse from "components/shared/forms/FormLinkCourse";
import EnrollmentCard from "components/shared/cards/EnrollmentCard";

// Custom
import { AddCourseButton, CourseListComponent } from "./styles";

// Interfaces
import IUser from "interfaces/IUser";
import IUserLogged from "interfaces/IUserLogged";
interface IEnrollmentListProps {
  user: IUserLogged | IUser;
  onChange?: Function;
  handleCloseModalForm?: Function;
}

export default function EnrollmentList({ user, onChange = () => { }, handleCloseModalForm }: IEnrollmentListProps) {
  const isOwnUser = "logged" in user && user.logged === true;
  const [fetching, setFetching] = useState<boolean>(false);
  const { dispatch } = store;

  async function fetchRemoveCourse(data) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/users/${data.userId}/unenroll/${data.courseId}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };
    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        dispatch(setCourses(response.data));
        onChange();
        if (handleCloseModalForm) {
          handleCloseModalForm();
        }

        toast.success("Curso desvinculado com sucesso.");
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          400: "Curso não associado ao usuário.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
        setFetching(false);
      });
  }

  return (
    <CustomForm isOwnUser={isOwnUser}>
      <div>
        {isOwnUser && <H5 style={{ marginBottom: 25 }}>Cursos vinculados</H5>}

        {user.courses.length === 0 &&
          <p className="title">
            Você ainda não possui nenhum curso vinculado à sua conta.
          </p>
        }

        <CourseListComponent style={!isOwnUser ? { marginTop: 0 } : {}}>
          <AddCourseButton
            onClick={(e) => {
              e.preventDefault();
              toggleModalForm(
                "Vincular curso",
                <FormLinkCourse user={user} onChange={onChange} handleCloseModalForm={handleCloseModalForm}
                  onEditSuccess={() => {
                    if (handleCloseModalForm) {
                      handleCloseModalForm();
                    }
                  }} />,
                "md"
              );
            }}>
            <i className="bi bi-plus-lg" />
            <span>Vincular curso</span>
          </AddCourseButton>

          {user.courses.map((course) => (
            <EnrollmentCard
              key={course.id}
              course={course}
              user={user}
              onChange={onChange}
              onDelete={() => fetchRemoveCourse({ userId: user.id, courseId: course.id })}
              handleCloseModalForm={handleCloseModalForm}
            />
          ))}
        </CourseListComponent>
      </div>
    </CustomForm>
  );
}
