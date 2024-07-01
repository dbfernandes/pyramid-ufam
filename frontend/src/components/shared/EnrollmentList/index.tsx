import { useState } from "react";
import { setCourses } from "redux/slicer/user";
import { getToken } from "utils";

// Shared
import toggleModalForm from "components/shared/ModalForm";
import { AddCourseButton, CourseListComponent } from "./styles";
import FormLinkCourse from "components/shared/forms/FormLinkCourse";
import EnrollmentCard from "components/shared/cards/EnrollmentCard";

// Interfaces
import { store } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { H5 } from "../Titles";

interface IEnrollmentListProps {
  user: IUserLogged;
}

export default function EnrollmentList({ user }: IEnrollmentListProps) {
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
    <div style={{ marginTop: 30 }}>
      <H5 style={{ marginBottom: 25 }}>Cursos vinculados</H5>

      {user.courses.length == 0 &&
        <p className="title">
          Você ainda não possui nenhum curso vinculado à sua conta.
        </p>
      }

      <CourseListComponent>
        <AddCourseButton
          onClick={() =>
            toggleModalForm(
              "Vincular curso",
              <FormLinkCourse user={user} />,
              "md"
            )
          }>
          <i className="bi bi-plus-lg" />
          <span>Vincular curso</span>
        </AddCourseButton>

        {user.courses.map((course) => (
          <EnrollmentCard
            key={course.id}
            course={course}
            onDelete={() => fetchRemoveCourse({ userId: user.id, courseId: course.id })}
          />
        ))}
      </CourseListComponent>
    </div>
  );
}