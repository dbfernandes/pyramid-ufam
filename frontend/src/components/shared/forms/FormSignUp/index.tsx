import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useDispatch } from "react-redux";
import { login, defaultCourse, authorize } from "redux/slicer/user";
import { useRouter } from "next/router";
import Link from "next/link";
import { checkPasswordStrength, validateCpf, validateEmail } from "utils";

// Shared
import Form from "components/shared/Form";
import {
  LinkWrapper,
  FormAlert,
  MultiField,
  SectionTitle,
} from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import { H3 } from "components/shared/Titles";
import { Logo } from "components/shared/forms/FormLogin/styles";
import SelectCustom from "components/shared/SelectCustom";
import PasswordStrength from "components/shared/PasswordStrength";

export default function FormSignUp() {
  const router = useRouter();

  // Inputs and validators
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPasswordStrengthDescription, setShowPasswordStrengthDescription] = useState<boolean>(false);
  function validatePassword(value) {
    return checkPasswordStrength(value).score >= 4;
  }
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  function validateConfirmPassword(value) {
    return value === password;
  }

  // Institutional info
  const [enrollment, setEnrollment] = useState<string>("");
  const handleEnrollment = (value) => {
    setEnrollment(value.toUpperCase());
  };

  const [startYear, setStartYear] = useState<string>("");
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

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function handleSignUp(e) {
    e.preventDefault();
    setSent(true);

    if (
      name.length != 0 &&
      validateEmail(email) &&
      validatePassword(password) &&
      validateConfirmPassword(confirmPassword) &&
      course != null &&
      validateStartYear(startYear) &&
      enrollment.length != 0
    ) {
      let data: any = {
        name,
        email,
        password,
        courseId: course,
        enrollment,
        startYear
      };

      if (cpf.trim().length > 0 && validateCpf(cpf)) data = { ...data, cpf };

      fetchSignUp(data);
    }
  }

  const dispatch = useDispatch();
  async function fetchSignUp(data) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/auth/sign-up`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "x-access-token, x-refresh-token"
      },
      data: data,
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setSuccess(true);

        if (response.data.user) {
          dispatch(authorize({
            token: response.headers["x-access-token"],
            refreshToken: response.headers["x-refresh-token"],
          }));
          dispatch(defaultCourse(response.data.user.courses[0]));
          dispatch(login(response.data.user));

          setTimeout(() => router.push(
            response.data.user.userTypeId == 3
              ? "/minhas-solicitacoes/nova"
              : "/solicitacoes"
          ), 250);
        }
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
    <Form>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <H3 style={{ marginBottom: 35 }}>Cadastro</H3>
        <Logo
          src={`${process.env.img}/full-logo.png`}
          style={{ height: 30, marginTop: "-15px" }}
        />
      </div>

      <SectionTitle>
        <b>1.</b> Informações pessoais
      </SectionTitle>

      <TextInput
        label={"Nome completo*"}
        name={"name"}
        value={name}
        handleValue={setName}
        required={true}
        displayAlert={sent}
        maxLength={255}
      />

      <TextInput
        label={"Email*"}
        name={"email"}
        value={email}
        handleValue={setEmail}
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
        handleValue={setCpf}
        validate={validateCpf}
        alert={"CPF Inválido"}
        displayAlert={sent}
        mask={"999.999.999-99"}
      />

      <MultiField>
        <div>
          <TextInput
            type={"password"}
            label={"Senha*"}
            name={"password"}
            value={password}
            handleValue={setPassword}
            validate={validatePassword}
            required={true}
            alert={"Senha fraca"}
            displayAlert={sent}
            maxLength={255}

            onFocus={() => setShowPasswordStrengthDescription(true)}
            onBlur={() => setShowPasswordStrengthDescription(false)}
          />
          <PasswordStrength password={password} showPasswordStrengthDescription={showPasswordStrengthDescription} />
        </div>

        <TextInput
          type={"password"}
          label={"Confirmar senha*"}
          name={"confirmPassword"}
          value={confirmPassword}
          handleValue={setConfirmPassword}
          validate={validateConfirmPassword}
          required={true}
          alert={"Senhas não conferem"}
          displayAlert={sent}
          maxLength={255}
        />
      </MultiField>

      <SectionTitle>
        <b>2.</b> Informações de matrícula
      </SectionTitle>

      <SelectCustom
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
        noOptionsMessage={"Nenhum curso encontrado"}
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
          handleValue={setStartYear}
          validate={validateStartYear}
          mask={"9999"}
          required={true}
          alert={"Ano inválido"}
          displayAlert={sent}
        />
      </MultiField>

      <Button style={{ marginTop: 15 }} onClick={(e) => handleSignUp(e)}>
        {fetching ? (
          <Spinner size={"20px"} color={"var(--white-1)"} />
        ) : (
          <>
            <i className="bi bi-check2-all" />
            Cadastrar
          </>
        )}
      </Button>

      <>
        {sent && !success && error?.length != 0 && (
          <FormAlert>{error}</FormAlert>
        )}
      </>

      <LinkWrapper>
        <Link href="/entrar">
          <a>Já tem conta?</a>
        </Link>
      </LinkWrapper>
    </Form>
  );
}
