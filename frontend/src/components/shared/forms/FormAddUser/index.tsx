import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import { getToken, validateCpf, validateEmail, slugify } from "utils";

// Shared
import {
  FormAlert,
  MultiField,
  SectionTitle,
} from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import { H3 } from "components/shared/Titles";
import SelectCustom from "components/shared/SelectCustom";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import { toast } from "react-toastify";

// Custom
import { CustomForm, FormSection } from "./styles";
import UserTypeSelect from "./UserTypeSelect";

export default function FormAddUser() {
  const userTypeSlugs = ["", "coordenador", "secretario", "aluno"];
  const router = useRouter();

  // Inputs and validators
  const [userTypeId, setUserTypeId] = useState<number | null>(router.query.tipo ? userTypeSlugs.indexOf(slugify(router.query.tipo.toString())) : null);
  const [selectKey, setSelectKey] = useState<number>(0);

  const [name, setName] = useState<string>("");
  const handleName = (value) => {
    setName(value);
  };

  const [email, setEmail] = useState<string>("");
  const handleEmail = (value) => {
    setEmail(value);
  };

  const [cpf, setCpf] = useState<string>("");
  const handleCpf = (value) => {
    setCpf(value);
  };

  // Institutional info
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

  const [courses, setCourses] = useState<any[]>([]);
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
        setCourses(response.data.courses);
        setSuccess(true);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        setError(
          code in errorMessages ? errorMessages[code] : errorMessages[0]
        );
        setSuccess(false);
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

  const [course, setCourse] = useState<any>(null);
  const handleCourse = (value) => {
    setCourse(value);
  };

  const [coursesMulti, setCoursesMulti] = useState<number[]>([]);
  const handleCoursesMulti = (value) => {
    setCoursesMulti(value);
  };

  // Resetting SelectCustom when user type changes
  useEffect(() => {
    setSelectKey(selectKey + 1);
    setCoursesMulti([]);
    setCourse(null);
    setCourseSearch("");
  }, [userTypeId]);

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function setDefaultState() {
    setSelectKey(selectKey + 1);

    setName("");
    setEmail("");
    setCpf("");
    setEnrollment("");
    setStartYear("");
    setCoursesMulti([]);
    setCourse(null);
    setCourseSearch("");

    setSent(false);
    setSuccess(false);
    setFetching(false);
    setError("");
  }

  function handleAddUser(e) {
    e.preventDefault();
    setSent(true);

    if (
      name.length != 0 &&
      validateEmail(email) &&
      (cpf.length == 0 || validateCpf(cpf)) &&
      ((
        userTypeId == 3 &&
        course != null &&
        validateStartYear(startYear) &&
        enrollment.length != 0
      ) ||
        (
          userTypeId !== 3 &&
          coursesMulti.length != 0
        ))
    ) {
      let data: any = {
        name,
        email,
        userType: ["", "Coordenador", "Secretário", "Aluno"][userTypeId ? userTypeId : 0],
      };

      if (userTypeId === 3) {
        data = {
          ...data,
          courseId: course,
          enrollment,
          startYear,
        };
      } else {
        data = {
          ...data,
          coursesIds: coursesMulti,
        };
      }

      if (cpf.trim().length > 0 && validateCpf(cpf)) data = { ...data, cpf };

      fetchAddUser(data);
    }
  }

  async function fetchAddUser(data) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/users`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      data: data,
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setSuccess(true);
        toast.success("Usuário adicionado com sucesso.");
        setDefaultState();
      })
      .catch((error) => {
        const badRequestMessages = {
          "Email already in use": "Email já cadastrado.",
          "CPF already in use": "CPF já cadastrado.",
          "Course not found": "Curso não encontrado.",
          "Enrollment already in use": "Matrícula já cadastrada.",
        };

        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          400: badRequestMessages[error?.response?.data?.message],
          403: "Recurso não disponível",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        setError(
          code in errorMessages ? errorMessages[code] : errorMessages[0]
        );

        setSuccess(false);
      });

    setFetching(false);
  }

  return (
    <DefaultWrapper>
      <CustomForm>
        <H3 style={{ marginBottom: 35 }}>Adicionar usuário</H3>

        <UserTypeSelect
          userTypeId={userTypeId}
          setUserTypeId={setUserTypeId}
        />

        {userTypeId &&
          <FormSection>
            <SectionTitle>
              <b>1.</b> Informações pessoais
            </SectionTitle>

            <TextInput
              label={"Nome completo*"}
              name={"name"}
              id={"name"}
              value={name}
              handleValue={handleName}
              required={true}
              displayAlert={sent}
              maxLength={255}
            />

            <TextInput
              label={"Email*"}
              name={"email"}
              value={email}
              handleValue={handleEmail}
              validate={validateEmail}
              required={true}
              alert={"Email inválido"}
              displayAlert={sent}
              maxLength={255}
            />

            <TextInput
              label={"CPF"}
              name={"cpf"}
              value={cpf}
              handleValue={handleCpf}
              validate={validateCpf}
              alert={"CPF Inválido"}
              displayAlert={sent}
              mask={"999.999.999-99"}
            />

            {userTypeId === 3
              ? (<>
                <SectionTitle>
                  <b>2.</b> Informações de matrícula
                </SectionTitle>

                <SelectCustom
                  key={selectKey}
                  label={"Curso*"}
                  name={"course"}
                  inputValue={courseSearch}
                  onInputChange={(value) => handleCourseSearch(value)}
                  value={course}
                  handleValue={handleCourse}
                  options={courses.map((course) => {
                    return {
                      value: course.id,
                      label: course.name,
                    };
                  })}
                  required={true}
                  displayAlert={sent}
                  fetching={fetchingCourses}
                  noOptionsMessagsMultie={"Nenhum curso encontrado"}
                />

                <MultiField>
                  <TextInput
                    label={"Matrícula*"}
                    name={"enrollment"}
                    value={enrollment}
                    handleValue={handleEnrollment}
                    // validate={validateEnrollment}
                    mask={"999999999"}
                    required={true}
                    // alert={"Matrícula inválida"}
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
                </MultiField>
              </>) : (<>
                <SectionTitle>
                  <b>2.</b> Cursos vinculados ao usuário
                </SectionTitle>

                <SelectCustom
                  key={selectKey}
                  label={"Cursos*"}
                  name={"courses"}
                  inputValue={courseSearch}
                  onInputChange={(value) => handleCourseSearch(value)}
                  value={coursesMulti}
                  handleValue={handleCoursesMulti}
                  options={courses.map((course) => {
                    return {
                      value: course.id,
                      label: course.name,
                    };
                  })}
                  required={true}
                  displayAlert={sent}
                  fetching={fetchingCourses}
                  noOptionsMessage={"Nenhum curso encontrado"}
                  isMulti={true}
                />
              </>)}

            <Button style={{ marginTop: 15 }} onClick={(e) => handleAddUser(e)}>
              {fetching ? (
                <Spinner size={"20px"} color={"var(--white-1)"} />
              ) : (
                <>
                  <i className="bi bi-check2-all" />
                  Adicionar
                </>
              )}
            </Button>

            <>
              {sent && !success && error?.length != 0 && (
                <FormAlert>{error}</FormAlert>
              )}
            </>
          </FormSection>
        }
      </CustomForm>
    </DefaultWrapper>
  );
}
