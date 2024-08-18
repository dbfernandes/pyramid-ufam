import { useEffect, useRef, useState } from "react";
import { Collapse, Dropdown, OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap";
import { formatCpf, getFirstAndLastName } from "utils";

// Shared
import toggleModalForm from "components/shared/ModalForm";
import FormUpdateAccount from "components/shared/forms/FormUpdateAccount";
import EnrollmentList from "components/shared/EnrollmentList";
import FormSendPasswordResetLink from "components/shared/forms/FormSendPasswordResetLink";

// Custom
import {
  Item,
  Column,
  Ribbon,
  DropdownMenu,
  DropdownItem,
  Options,
  CustomFormCheck,
  CheckboxPreventClick,
  UserStatus,
  CopyToClipboardSpan,
} from "./styles";
import Spinner from "components/shared/Spinner";

// Interfaces
import IUser from "interfaces/IUser";
import { CollapseDetailsStyled, FileInfo, HideOnSmallScreen, Info, ToggleButton } from "components/shared/cards/SubmissionCard/styles";
import { H6 } from "components/shared/Titles";
import UserActions from "components/shared/cards/SubmissionCard/UserActions";

interface IUserProps {
  user?: IUser | null;
  courseId?: number | null | undefined;
  subRoute?: string;
  loading?: boolean;
  header?: boolean;

  fetchingDelete?: boolean;
  onDelete?: Function;
  fetchingRestore?: boolean;
  onRestore?: Function;
  onChange?: Function;

  checkedIds?: number[];
  setCheckedIds?: React.Dispatch<React.SetStateAction<number[]>>;

  disableMenu?: boolean;
}

export default function User({
  user = null,
  courseId = null,
  subRoute = "",
  loading = false,
  header = false,

  fetchingDelete = false,
  onDelete = () => { },
  fetchingRestore = false,
  onRestore = () => { },
  onChange = () => { },

  checkedIds = [],
  setCheckedIds = () => { },

  disableMenu = false,

  ...props
}: IUserProps) {
  function handleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  const [confirmDanger, setConfirmDanger] = useState<boolean>(false);
  function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirmDanger) setConfirmDanger(!confirmDanger);
    else onDelete();
  }

  function handleRestore(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirmDanger) setConfirmDanger(!confirmDanger);
    else onRestore();
  }

  function handleCheck(e) {
    e.stopPropagation();

    let allValues = [];
    const checks = document.getElementsByName("users");

    checks.forEach((check) => {
      if ("value" in check && check.value != "all") {
        let _value = parseInt(check.value as string) as never;
        allValues.push(_value);
      }
    });

    if (e.target.value != "all") {
      const value = parseInt(e.target.value);
      const index = checkedIds.indexOf(value);

      // Hardcopying the array
      let _checkedIds = JSON.parse(JSON.stringify(checkedIds));

      if (e.target.checked && index === -1) {
        _checkedIds.push(value);
      } else if (!e.target.checked && index !== -1) {
        _checkedIds.splice(index, 1);
      }

      setCheckedIds(_checkedIds);

      const checkboxAll = document.getElementById("check-all");
      if (checkboxAll != null && "checked" in checkboxAll) {
        checkboxAll.checked = JSON.stringify(_checkedIds.sort()) === JSON.stringify(allValues);
      }
    } else {
      checks.forEach((check) => {
        if ("checked" in check) {
          check["checked"] = e.target.checked;
        }
      });

      setCheckedIds(e.target.checked ? allValues : []);
    }
  }

  
  const [collapsed, setCollapsed] = useState<boolean>(false);
  function CollapseDetails({ user, onChange }) {
    function getCpf(user) {
      return user?.cpf ? formatCpf(user?.cpf) : "-"
    }
    
    function getTotalWorkload(user) {
      const ensino = user?.workloadCount?.["Ensino"]?.totalWorkload || 0;
      const pesquisa = user?.workloadCount?.["Pesquisa"]?.totalWorkload || 0;
      const extensao = user?.workloadCount?.["Extensão"]?.totalWorkload || 0;
      
      return ensino + pesquisa + extensao;
    }
  
    function getRemainingWorkload(user) {
      const totalWorkload = getTotalWorkload(user);
      const maxWorkload = Math.max(
        user?.workloadCount?.["Ensino"]?.maxWorkload || 0,
        user?.workloadCount?.["Pesquisa"]?.maxWorkload || 0,
        user?.workloadCount?.["Extensão"]?.maxWorkload || 0
      );
      return maxWorkload - totalWorkload;
    }

    const remainingWorkload = getRemainingWorkload(user); 

    function CustomProgressBar({ current, max }) {
      const progress = (current / max) * 100;
      
      return (
        <OverlayTrigger placement="bottom" overlay={<Tooltip>{`${current}h de ${max}h`}</Tooltip>}>
          <ProgressBar
            animated
            now={current === 0 ? 100 : progress}
            label={current === 0 ? `0/0` : `${current}/${max}`}
            variant={current === 0 ? "secondary" : "success"}
            style={{
              borderRadius: "8px",
              height: "15px",
              backgroundColor: "#F1F1F1",
            }}
          />
        </OverlayTrigger>
      );
    }

    return (
      <CollapseDetailsStyled>
        <div className="grid">
        {(user) && (
            <Info>
              <H6>
                {user.userTypeId === 1
                  ? "Coordenador"
                  : user.userTypeId === 2
                  ? "Secretário"
                  : "Aluno"}
              </H6>
              <p>
                <b>Nome:</b> {user.name}
              </p>
              <p>
                <b>Email:</b> {user.email}
              </p>
              {user?.cpf && (
                <p>
                  <b>CPF:</b> {getCpf(user)}
                </p>
              )}
              <p>
                <b>Curso(s):</b> {user?.courses && user?.courses.length > 0 
                  ? (
                    <div className="text-with-ribbon">
                      {user.courses.map((course, index) => (
                        <><span key={index}>{course.name}</span><br /></>
                      ))}
                    </div>
                  )
                  : "-"
                }
              </p>
              <p>
                <b>Status:</b> {user?.isActive === true ? "Ativo" : "Inativo"}
              </p>
              <p>
                {user?.userTypeId == 3 && (
                  <p>
                    <b>Matrícula deste curso:</b> {enrollment}
                  </p>
                )
                }
              </p>
            </Info>
          )}
            {user?.userTypeId == 3 && (<Info>
              <H6>Resumo de carga horária</H6>

              <p>
                <b>Horas (Ensino):</b> <CustomProgressBar current={user?.workloadCount?.["Ensino"]?.totalWorkload || 0} max={user?.workloadCount?.["Ensino"]?.maxWorkload || 0} />
              </p>
              <p>
                <b>Horas (Pesquisa):</b> <CustomProgressBar current={user?.workloadCount?.["Pesquisa"]?.totalWorkload || 0} max={user?.workloadCount?.["Pesquisa"]?.maxWorkload || 0} />
              </p>
              <p>
                <b>Horas (Extensão):</b> <CustomProgressBar current={user?.workloadCount?.["Extensão"]?.totalWorkload || 0} max={user?.workloadCount?.["Extensão"]?.maxWorkload || 0} />
              </p>
              <p>
                <b>Total de horas realizadas:</b> {getTotalWorkload(user)}h
              </p>
              <p>
                {remainingWorkload <= 0 
                  ? "O aluno já cumpriu todas as horas necessárias."
                  : `Faltam ${remainingWorkload}h para completar a carga horária.`}
              </p>
            </Info>)}
        </div>
        
      </CollapseDetailsStyled>
    );
  }

  // Courses column
  function CoursesColumnTooltip({ courses }) {
    return (
      <>
        {courses.map((course, index) => <p key={index} style={{ margin: 0 }}>{course.name}</p>)}
      </>
    );
  }

  // Copy to clipboard
  function CopyToClipboard({ text }) {
    const [copied, setCopied] = useState(false);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    function copyToClipboard() {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        timeout.current = setTimeout(() => setCopied(false), 2000);
      });
    }

    useEffect(() => {
      return () => {
        if (timeout.current !== null) {
          clearTimeout(timeout.current);
        }
      };
    }, []);

    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip>{`${text} (${copied ? "Copiado!" : "Clique para copiar"})`}</Tooltip>}>
        <CopyToClipboardSpan onClick={copyToClipboard}>
          {text}
          <i className="bi bi-copy" />
        </CopyToClipboardSpan>
      </OverlayTrigger>
    );
  }

  const CustomProgressBar = ({ current, max }) => {
    const progress = (current / max) * 100;

    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip>{`${current}h de ${max}h`}</Tooltip>}>
        <ProgressBar
          animated
          now={current === 0 ? 100 : progress}
          label={current === 0 ? `0/0` : `${current}/${max}`}
          variant={current === 0 ? "secondary" : "success"}
          style={{
            borderRadius: "8px",
            height: "15px",
            backgroundColor: "#F1F1F1",
          }}
        />
      </OverlayTrigger>
    );
  };

  function WorkloadProgressBars({ workloadCount }) {
    return (
      <>
        <Column><CustomProgressBar current={workloadCount["Ensino"].totalWorkload} max={workloadCount["Ensino"].maxWorkload} /></Column>
        <Column><CustomProgressBar current={workloadCount["Pesquisa"].totalWorkload} max={workloadCount["Pesquisa"].maxWorkload} /></Column>
        <Column><CustomProgressBar current={workloadCount["Extensão"].totalWorkload} max={workloadCount["Extensão"].maxWorkload} /></Column>
      </>
    )
  }

  // Column value helpers
  function getEnrollment(user) {
    const course = user?.courses.find((course) => course.id === courseId);
    if (!course?.enrollment) return "-";
    return course?.enrollment;
  }
  const enrollment = getEnrollment(user);

  /*function getCpf(user) {
    return user?.cpf ? formatCpf(user?.cpf) : "-"
  }
  const cpf = getCpf(user);*/



  return (
    header
      ? <Item header={true} student={subRoute === "alunos"}>
        <CustomFormCheck
          id="check-all"
          inline
          name="users"
          value={"all"}
          label={""}
          onClick={(e) => handleCheck(e)}
        />
        <HideOnSmallScreen><Column color={"var(--muted)"}>Nome</Column></HideOnSmallScreen>
        {subRoute == "alunos"
          ? <>
            <HideOnSmallScreen><Column color={"var(--muted)"}>Matrícula</Column></HideOnSmallScreen>
            <HideOnSmallScreen><Column color={"var(--muted)"}>Horas (Ensino)</Column></HideOnSmallScreen>
            <HideOnSmallScreen><Column color={"var(--muted)"}>Horas (Pesquisa)</Column></HideOnSmallScreen>
            <HideOnSmallScreen><Column color={"var(--muted)"}>Horas (Extensão)</Column></HideOnSmallScreen>
          </>
          : <>
            <HideOnSmallScreen><Column color={"var(--muted)"}>Email</Column></HideOnSmallScreen>
            <HideOnSmallScreen><Column color={"var(--muted)"}>Curso(s)</Column></HideOnSmallScreen>
          </>
        }
        <HideOnSmallScreen><Column color={"var(--muted)"}>Status</Column></HideOnSmallScreen>
      </Item>
      : loading
        ? <Item student={subRoute === "alunos"}>
          <div></div>
          {Array.from(Array(subRoute === "alunos" ? 5 : 3).keys()).map((i) => <Column key={i} className={"placeholder-wave"}><span className={"placeholder col-md-8 col-12"}></span></Column>)}
          <div></div>
        </Item >
        : (//<Link href={`/usuarios/${subRoute}/${user?.id}`} passHref><a>
          <>
          <Item student={subRoute === "alunos"}>
            <CustomFormCheck
              inline
              name="users"
              value={user?.id.toString()}
              label={<CheckboxPreventClick onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} />}
              onClick={(e) => handleCheck(e)}
            />

            <HideOnSmallScreen>
              <Column>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>{user?.name}</Tooltip>}>
                  <span>{user?.name}</span>
                </OverlayTrigger>
              </Column>
            </HideOnSmallScreen>


            {subRoute == "alunos"
              ? <>
            <HideOnSmallScreen>
                <Column>
                  <CopyToClipboard text={enrollment} />
                </Column>
            </HideOnSmallScreen>

                <WorkloadProgressBars workloadCount={user?.workloadCount} />
              </>
              : <>
            <HideOnSmallScreen>
                <Column>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip>{user?.email}</Tooltip>}>
                    <span>{user?.email}</span>
                  </OverlayTrigger>
                </Column>
            </HideOnSmallScreen>
              

              <HideOnSmallScreen>
                <Column>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip><CoursesColumnTooltip courses={user?.courses} /></Tooltip>}>
                    <span>
                      {user?.courses && user?.courses.length > 0 && user?.courses[0]?.name
                        ? (<div className="text-with-ribbon">
                          <span>{user?.courses[0]?.name}</span>
                          {(user?.courses && user?.courses?.length > 1) &&
                            <Ribbon>+{user?.courses?.length - 1}</Ribbon>
                          }
                        </div>)
                        : "-"
                      }
                    </span>
                  </OverlayTrigger>
                </Column>
              </HideOnSmallScreen>

              </>
            }
            <HideOnSmallScreen>
              <Column>
                <UserStatus status={user?.isActive}>{user?.isActive === true ? "Ativo" : "Inativo"}</UserStatus>
              </Column>
            </HideOnSmallScreen>

            {user && !disableMenu
              ? (
                <Dropdown align="end" onClick={(e) => handleDropdown(e)} onMouseLeave={() => setConfirmDanger(false)}>
                  <Options variant="secondary">
                    <i className="bi bi-three-dots-vertical" />
                  </Options>

                  <DropdownMenu renderOnMount={true}>
                    {user && (<DropdownItem onClick={() => 
                      toggleModalForm(
                        `Editar informações (${getFirstAndLastName(user?.name)})`,
                        <FormUpdateAccount user={user} onChange={onChange}/>,
                        "lg"
                      )
                      } accent={"var(--success)"}>
                      <i className="bi bi-pencil-fill"></i> Editar informações
                    </DropdownItem>)}
                    {user && (<DropdownItem onClick={() => 
                      toggleModalForm(
                        `Editar cursos (${getFirstAndLastName(user?.name)})`,
                        <EnrollmentList user={user} onChange={onChange}/>,
                        "lg"
                      )
                      } accent={"var(--success)"}>
                      <i className="bi bi-mortarboard-fill"></i> Editar cursos
                    </DropdownItem>)}
                    {user && (<DropdownItem onClick={() => 
                      toggleModalForm(
                        `Resetar senha (${getFirstAndLastName(user?.name)})`,
                        <FormSendPasswordResetLink user={user}/>,
                        "lg"
                      )
                      } accent={"var(--success)"}>
                      <i className="bi bi-key-fill"></i> Resetar senha
                    </DropdownItem>)}

                    {user?.isActive === true
                      ? (
                        <DropdownItem onClick={(e) => handleDelete(e)} accent={"var(--danger)"}>
                          {confirmDanger
                            ? fetchingDelete ? <Spinner size={"21px"} color={"var(--danger)"} /> : <><i className="bi bi-exclamation-circle-fill"></i> Confirmar</>
                            : <><i className="bi bi-trash-fill"></i> Desativar</>
                          }
                        </DropdownItem>
                      ) : (
                        <DropdownItem onClick={(e) => handleRestore(e)} accent={"var(--warning)"}>
                          {confirmDanger
                            ? fetchingRestore ? <Spinner size={"21px"} color={"var(--warning)"} /> : <><i className="bi bi-exclamation-circle-fill"></i> Confirmar</>
                            : <><i className="bi bi-exclamation-triangle-fill"></i> Reativar</>
                          }
                        </DropdownItem>
                      )
                    }
                  </DropdownMenu>
                </Dropdown>
              ) : <div />}

            <ToggleButton 
              expanded={collapsed}
              onClick={() => setCollapsed(!collapsed)} // Adicionar a lógica para alternar o estado
            >
              <i className={`bi bi-chevron-${collapsed ? "up" : "down"}`}></i>
            </ToggleButton>
          </Item>

        <Collapse in={collapsed}>
          <div>
            <CollapseDetails user={user} onChange={onChange} />
          </div>
        </Collapse>
        </>
        )
  );
}