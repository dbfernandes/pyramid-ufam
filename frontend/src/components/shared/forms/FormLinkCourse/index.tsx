import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "utils";
import { setCourses } from "redux/slicer/user";
import { store } from "redux/store";

// Shared
import { MultiField, FormAlert } from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import SelectCustom from "components/shared/SelectCustom";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import Content from "components/shared/ModalForm/Content";
import { toast } from "react-toastify";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";

interface IFormComponentProps {
  course?: any;
  user: IUserLogged;
  handleCloseModalForm?: Function;
}

export default function FormLinkCourse({
  course: courseProp = null,
  user,
  handleCloseModalForm,
}: IFormComponentProps) {
  const operation = courseProp == null ? "Vincular" : "Editar";
  const isStudent = user.userTypeId === 3;

  // Inputs and validators
  const [enrollment, setEnrollment] = useState<string>("");
  const handleEnrollment = (value) => {
    setEnrollment(value.toUpperCase());
  };

  const [startYear, setStartYear] = useState<string>("");
  const handleStartYear = (value) => {
    setStartYear(value);
  };
  function validateStartYear(value) {
    return value.length === 4 && !isNaN(value) && parseInt(value) > 1909 && parseInt(value) <= new Date().getFullYear();
  }

  // Courses
  const [_courses, _setCourses] = useState<any[]>([]);
  const [fetchingCourses, setFetchingCourses] = useState<boolean>(true);
  async function fetchCourses(search = "") {
    setFetchingCourses(true);

    const options = {
      url: `${process.env.api}/courses?search=${search}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        const __courses = response.data.courses.filter((course1) => {
          return !user.courses.some((course2) => course1.id === course2.id);
        });
        _setCourses(__courses);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingCourses(false);
  }

  const [courseSearch, setCourseSearch] = useState<string>("");
  const handleCourseSearch = (value) => {
    setCourseSearch(value);
  };

  useEffect(() => {
    setFetchingCourses(true);
    const debounce = setTimeout(() => {
      fetchCourses(courseSearch);
    }, 1000);

    return () => clearTimeout(debounce);
  }, [courseSearch]);

  const [course, setCourse] = useState<any>();
  const handleCourse = (value) => {
    setCourse(value);
  };

  // Loading course prop
  useEffect(() => {
    if (courseProp != null) {
      setEnrollment(courseProp?.enrollment);
      setStartYear(courseProp?.startYear.toString());
      setCourse({
        value: courseProp?.id,
        label: courseProp?.name,
      });
    }
  }, [courseProp]);

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Add or Edit
  function handleAddCourse(e) {
    e.preventDefault();
    setSent(true);
    if (course !== null) {
      let data: any = {
        userId: user.id,
        courseId: course?.value ? course?.value : course
      };

      if (isStudent && (enrollment.length != 0 && validateStartYear(startYear))) {
        data = { ...data, enrollment, startYear };
      }

      if ((isStudent && (enrollment.length != 0 && validateStartYear(startYear))) || (!isStudent && course !== null)) {
        fetchAddCourse(data, operation === "Editar");
      }
    }
  }

  const { dispatch } = store;
  async function fetchAddCourse(data, isEdit = false) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/users/${data.userId}/enroll/${data.courseId}`,
      method: isEdit ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      data: {
        enrollment: data.enrollment,
        startYear: data.startYear,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setSuccess(true);
        if (handleCloseModalForm) {
          handleCloseModalForm();
        }
        dispatch(setCourses(response.data));
        toast.success(isEdit ? "Matrícula alterada com sucesso." : "Curso vinculado com sucesso.");
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          400: "Curso já associado ao usuário.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        setError(
          code in errorMessages ? errorMessages[code] : errorMessages[0]
        );
        setSuccess(false);
        setFetching(false);
      });
  }

  return (
    <Content>
      <div style={{ width: "100%" }}>
        {!courseProp && (
          <SelectCustom
            label={"Curso*"}
            name={"course"}
            inputValue={courseSearch}
            onInputChange={(value) => handleCourseSearch(value)}
            value={course}
            handleValue={handleCourse}
            defaultInputValue={courseProp?.course?.name}
            defaultValue={{
              value: courseProp?.courseId,
              label: courseProp?.course?.name,
            }}
            options={_courses.map((course) => {
              return {
                value: course.id,
                label: course.name,
              };
            })}
            required={true}
            displayAlert={sent}
            fetching={fetchingCourses}
            noOptionsMessage={"Nenhum curso encontrado"}
          />
        )}

        {isStudent && (<MultiField>
          <TextInput
            label={"Matrícula*"}
            name={"enrollment"}
            value={enrollment}
            handleValue={handleEnrollment}
            mask={"999999999"}
            required={true}
            displayAlert={sent}
          />

          <TextInput
            label={"Ano de início*"}
            name={"startYear"}
            value={startYear}
            handleValue={handleStartYear}
            validate={validateStartYear}
            mask={"9999"}
            required={true}
            alert={"Ano inválido"}
            displayAlert={sent}
          />
        </MultiField>)}
      </div>

      <div style={{ width: "100%" }}>
        <>
          {sent && !success && error.length != 0 && (
            <FormAlert>{error}</FormAlert>
          )}
        </>

        <Button style={{ marginTop: 15 }} onClick={(e) => handleAddCourse(e)}>
          {fetching ? (
            <Spinner size={"20px"} color={"var(--black-1)"} />
          ) : (
            <>
              <i className="bi bi-check2-all" />
              {operation}
            </>
          )}
        </Button>
      </div>
    </Content>
  );
}
