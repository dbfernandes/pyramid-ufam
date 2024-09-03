import { useEffect, useRef, useState } from "react";
import { Collapse, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatCpf, getFirstAndLastName } from "utils";

// Shared
import toggleModalForm from "components/shared/ModalForm";
import FormUpdateAccount from "components/shared/forms/FormUpdateAccount";
import EnrollmentList from "components/shared/EnrollmentList";
import FormSendPasswordResetLink from "components/shared/forms/FormSendPasswordResetLink";
import { CollapseDetailsStyled, Info, ToggleButton } from "components/shared/cards/SubmissionCard/styles";
import { H6 } from "components/shared/Titles";

// Custom
import {
  ItemWrapper,
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
  UserProfilePicture,
  CustomProgressBarWrapper,
  CustomProgressBar,
} from "./styles";
import Spinner from "components/shared/Spinner";

// Interfaces
import IUser from "interfaces/IUser";
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

  // Workload
  const selectedCourse = user?.courses.find((course) => course.id === courseId);
  const minWorkload = selectedCourse?.minWorkload || 0;
  const workloadCount = selectedCourse?.workloadCount;
  const totalWorkload = workloadCount?.totalWorkload || 0;
  const hoursRemaining = minWorkload - totalWorkload;
  const isComplete = hoursRemaining <= 0;

  function ProgressBar({ current, max }) {
    const progress = (current / max) * 100;
    const background = current > 0 ? "var(--text-default)" : "var(--muted)";

    return (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>{`${current}h de ${max}h`}</Tooltip>}
      >
        <CustomProgressBarWrapper>
          <CustomProgressBar
            animated
            now={progress}
            variant="success"
            background={background}
          />
          <span>{current}/{max}</span>
        </CustomProgressBarWrapper>
      </OverlayTrigger>
    );
  }

  function Workload() {
    return (
      workloadCount
        ? <>
          <Column hideOnMobile={true}>{workloadCount?.["Ensino"]?.totalWorkload}h</Column>
          <Column hideOnMobile={true}>{workloadCount?.["Pesquisa"]?.totalWorkload}h</Column>
          <Column hideOnMobile={true}>{workloadCount?.["Extensão"]?.totalWorkload}h</Column>
        </>
        : null
    )
  }

  // More details
  const [collapsed, setCollapsed] = useState<boolean>(false);
  function CollapseDetails({ user, onChange }) {
    function getCpf(user) {
      return user?.cpf ? formatCpf(user?.cpf) : "-"
    }

    return (
      <CollapseDetailsStyled>
        <div className="grid">
          {(user) && (
            <Info>
              <H6>Aluno</H6>

              <UserProfilePicture
                big={true}
                src={user?.profileImage && user?.profileImage.length > 0
                  ? user?.profileImage
                  : `${process.env.img}/user.png`
                }
                alt={user?.name}
                onError={({ currentTarget }) => {
                  currentTarget.src = `${process.env.img}/user.png`;
                }}
              />
              <p><b>Nome:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              {user?.cpf && (
                <p><b>CPF:</b> {getCpf(user)}</p>
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
              <p><b>Status:</b> <UserStatus status={user?.isActive}>{user?.isActive === true ? "Ativo" : "Inativo"}</UserStatus></p>
            </Info>

          )}
          {user?.userTypeId === 3 && (
            <Info>
              <H6>Informações do curso</H6>

              <p><b>Matrícula deste curso:</b> {enrollment}</p>
              <hr />

              <p><b>Horas (Ensino):</b> {workloadCount?.["Ensino"]?.totalWorkload}h</p>
              <p><b>Horas (Pesquisa):</b> {workloadCount?.["Pesquisa"]?.totalWorkload}h</p>
              <p><b>Horas (Extensão):</b> {workloadCount?.["Extensão"]?.totalWorkload}h</p>
              <hr />

              <div style={{ display: 'flex', flexDirection: 'column', margin: '0' }}>
                <div>
                  <b>Total:</b>
                </div>
                <div style={{ width: '100%', marginTop: '8px' }}>
                  <ProgressBar current={totalWorkload} max={minWorkload} />
                </div>
              </div>
              <hr />

              <p><b>Status de Conclusão:</b> {isComplete ? 'Carga horária concluída!' : `Faltam ${hoursRemaining} horas`}</p>
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

    function copyToClipboard(e) {
      e.stopPropagation();
      e.preventDefault();

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

  // Column value helpers
  function getEnrollment(user) {
    const course = user?.courses.find((course) => course.id === courseId);
    if (!course?.enrollment) return "-";
    return course?.enrollment;
  }
  const enrollment = getEnrollment(user);

  return (
    header
      ? (
        <Item header={true} student={subRoute === "alunos"}>
          <CustomFormCheck
            id="check-all"
            inline
            name="users"
            value={"all"}
            label={""}
            onClick={(e) => handleCheck(e)}
          />
          <div />
          <Column color={"var(--muted)"}>Nome</Column>
          {subRoute == "alunos"
            ? <>
              <Column color={"var(--muted)"} hideOnMobile={true}>Matrícula</Column>
              <Column color={"var(--muted)"} hideOnMobile={true}>Horas (Ensino)</Column>
              <Column color={"var(--muted)"} hideOnMobile={true}>Horas (Pesquisa)</Column>
              <Column color={"var(--muted)"} hideOnMobile={true}>Horas (Extensão)</Column>
              <Column color={"var(--muted)"}>Total</Column>
              <Column color={"var(--muted)"} hideOnMobile={true}>Status</Column>
            </>
            : <>
              <Column color={"var(--muted)"} hideOnMobile={true}>Email</Column>
              <Column color={"var(--muted)"} hideOnMobile={true}>Curso(s)</Column>
            </>
          }
        </Item>
      ) : loading
        ? (
          <Item student={subRoute === "alunos"}>
            <div />
            {Array.from(Array(subRoute === "alunos" ? 5 : 3).keys()).map((i) => <Column key={i} className={"placeholder-glow"}><span className={"placeholder col-md-8 col-12"}></span></Column>)}
            <div />
            <div />
          </Item >
        ) : (
          <ItemWrapper>
            <Item
              student={subRoute === "alunos"}
              onClick={() => setCollapsed(!collapsed)}
              aria-expanded={collapsed}
              collapsed={collapsed}>
              <CustomFormCheck
                inline
                name="users"
                value={user?.id.toString()}
                label={
                  <CheckboxPreventClick
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                }
                onClick={(e) => handleCheck(e)}
              />

              <UserProfilePicture
                src={
                  user?.profileImage && user?.profileImage.length > 0
                    ? user?.profileImage
                    : `${process.env.img}/user.png`
                }
                alt={user?.name}
                onError={({ currentTarget }) => {
                  currentTarget.src = `${process.env.img}/user.png`;
                }}
              />

              <Column>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>{user?.name}</Tooltip>}>
                  <span>{user?.name}</span>
                </OverlayTrigger>
              </Column>

              {subRoute == "alunos"
                ? <>
                  <Column hideOnMobile={true}>
                    <CopyToClipboard text={enrollment} />
                  </Column>

                  <Workload />
                  <ProgressBar current={totalWorkload} max={minWorkload} />
                </>
                : <>
                  <Column hideOnMobile={true}>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>{user?.email}</Tooltip>}>
                      <span>{user?.email}</span>
                    </OverlayTrigger>
                  </Column>

                  <Column hideOnMobile={true}>
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

                </>
              }
              <Column hideOnMobile={true}>
                <UserStatus status={user?.isActive}>{user?.isActive === true ? "Ativo" : "Inativo"}</UserStatus>
              </Column>

              <ToggleButton expanded={collapsed}>
                <i className={`bi bi-chevron-${collapsed ? "up" : "down"}`}></i>
              </ToggleButton>

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
                          <FormUpdateAccount user={user} onChange={onChange} />,
                          "lg"
                        )
                      } accent={"var(--success)"}>
                        <i className="bi bi-pencil-fill"></i> Editar informações
                      </DropdownItem>)}
                      {user && (<DropdownItem onClick={() =>
                        toggleModalForm(
                          `Editar cursos (${getFirstAndLastName(user?.name)})`,
                          <EnrollmentList user={user} onChange={onChange} />,
                          "lg"
                        )
                      } accent={"var(--success)"}>
                        <i className="bi bi-mortarboard-fill"></i> Editar cursos
                      </DropdownItem>)}
                      {user && (<DropdownItem onClick={() =>
                        toggleModalForm(
                          `Resetar senha (${getFirstAndLastName(user?.name)})`,
                          <FormSendPasswordResetLink user={user} />,
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
            </Item>

            <Collapse in={collapsed}>
              <div>
                <CollapseDetails user={user} onChange={onChange} />
              </div>
            </Collapse>
          </ItemWrapper>
        )
  );
}