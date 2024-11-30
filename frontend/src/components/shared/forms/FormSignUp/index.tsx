import { useState, useEffect } from "react";
import axios, { Axios, AxiosRequestConfig } from "axios";
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
import { toast } from "react-toastify";


export default function FormSignUp() {
  const router = useRouter();

  // Estados
  const [email, setEmail] = useState<string>(""); // Email inicial
  const [verificationCode, setVerificationCode] = useState<string>(""); // Código de verificação
  const [emailVerified, setEmailVerified] = useState<boolean>(false); // E-mail verificado

  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPasswordStrengthDescription, setShowPasswordStrengthDescription] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0); // Controle de etapas: 0 = Email, 1 = Código, 2 = Cadastro


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

  // Função para enviar o código de verificação
  async function handleSendVerificationCode(e) {
    e.preventDefault();
    setFetching(true);
    setError("");

    const options = {
      url: `${process.env.api}/auth/send-verification`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: { email },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        toast.success("O código de confirmação foi enviado para o seu e-mail.");
        setStep(1); // Avança para a etapa de verificação do código
      })
      .catch((error) => {
        toast.error("O código de confirmação não foi enviado para o seu e-mail.");
        setError("Erro ao enviar o código de verificação. Tente novamente.");
      })
    setFetching(false);
  }

  // Função para verificar o código de validação
  async function handleVerifyEmail(e) {
    e.preventDefault();
    setFetching(true);
    setError("");

    const options = {
      url: `${process.env.api}/auth/verify-email`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: { email, code: verificationCode },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        toast.success("E-mail validado com sucesso.");
        setStep(2);
        setEmailVerified(true)
      })
      .catch((error) => {
        toast.error("Código incorreto.");
        setError("Código de verificação inválido. Tente novamente.");
      })
    setFetching(false);
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setSent(true);

    if (
      name.length != 0 &&
      validateEmail(email) &&
      validateCpf(cpf) &&
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
        toast.success("Usuário cadastrado com sucesso.")

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

        toast.error("Usuário não foi cadastrado.")
        setSuccess(false);
      });

    setFetching(false);
  }

  function maskEmail(email) {
    const [localPart, domain] = email.split("@");
    
    if (localPart.length <= 2) {
      return `${localPart}@${domain}`;
    }
  
    const visibleStart = localPart.slice(0, 3);
    const visibleEnd = localPart.slice(-3);
    const maskedMiddle = "*".repeat(localPart.length - 5); 
    
    return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
  }
  
  return (
    <Form>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <H3 style={{ marginBottom: 35 }}>Cadastro</H3>
        <Logo src={`${process.env.img}/full-logo.png`} style={{ height: 30, marginTop: "-15px" }} />
      </div>

      {/* Etapa 0: Inserir e-mail */}
      {step === 0 && (
        <>
          <SectionTitle><b>1.</b> Insira seu e-mail</SectionTitle>
          <TextInput
            label={"Email*"}
            name={"email"}
            value={email}
            handleValue={setEmail}
            validate={validateEmail}
            required={true}
            displayAlert={sent}
            maxLength={255}
          />
          <Button style={{ marginTop: 15 }} onClick={handleSendVerificationCode}>
            {fetching ? (
              <Spinner size={"20px"} color={"var(--white-1)"} />
             ) : (
              <>
                <i className="bi bi-envelope-arrow-up"/>
                Enviar Código
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
        </>
      )}

      {/* Etapa 1: Verificar código */}
      {step === 1 && (
        <>
          <SectionTitle><b>2.</b> Verifique seu e-mail {maskEmail(email)}</SectionTitle>
          <TextInput
            label={"Código de verificação*"}
            name={"verificationCode"}
            value={verificationCode}
            handleValue={setVerificationCode}
            displayAlert={sent} 
            required={true}
          />

          <Button style={{ marginTop: 15 }} onClick={handleVerifyEmail} disabled={fetching || verificationCode.length === 0}>
            {fetching ? (
              <Spinner size={"20px"} color={"var(--white-1)"} />
            ) : (
              <>
                <i className="bi bi-send" />
                Verificar código
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
        </>
      )}

      {/* Etapa 2: Cadastro completo */}
      {step === 2 && emailVerified && (
        <>
          <SectionTitle><b>3.</b> Informações Pessoais</SectionTitle>
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

          <SectionTitle><b>4.</b> Informações de Matrícula</SectionTitle>

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
        </>
      )}
    </Form>
  );
}
