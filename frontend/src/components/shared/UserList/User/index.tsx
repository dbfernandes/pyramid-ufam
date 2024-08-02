import { useEffect, useRef, useState } from "react";
import { Dropdown, OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap";
import { formatCpf, getFirstAndLastName } from "utils";
import toggleModalForm from "components/shared/ModalForm";

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
import FormAddUser from "components/shared/forms/FormAddUser";
import FormSendPasswordResetLink from "components/shared/forms/FormSendPasswordResetLink";
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
        <Column color={"var(--muted)"}>Nome</Column>
        {subRoute == "alunos"
          ? <>
            <Column color={"var(--muted)"}>Matrícula</Column>
            <Column color={"var(--muted)"}>Horas (Ensino)</Column>
            <Column color={"var(--muted)"}>Horas (Pesquisa)</Column>
            <Column color={"var(--muted)"}>Horas (Extensão)</Column>
          </>
          : <>
            <Column color={"var(--muted)"}>Email</Column>
            <Column color={"var(--muted)"}>Curso(s)</Column>
          </>
        }
        <Column color={"var(--muted)"}>Status</Column>
      </Item>
      : loading
        ? <Item student={subRoute === "alunos"}>
          <div></div>
          {Array.from(Array(subRoute === "alunos" ? 5 : 3).keys()).map((i) => <Column key={i} className={"placeholder-wave"}><span className={"placeholder col-md-8 col-12"}></span></Column>)}
          <div></div>
        </Item >
        : (//<Link href={`/usuarios/${subRoute}/${user?.id}`} passHref><a>
          <Item student={subRoute === "alunos"}>
            <CustomFormCheck
              inline
              name="users"
              value={user?.id.toString()}
              label={<CheckboxPreventClick onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} />}
              onClick={(e) => handleCheck(e)}
            />

            <Column>
              <OverlayTrigger placement="bottom" overlay={<Tooltip>{user?.name}</Tooltip>}>
                <span>{user?.name}</span>
              </OverlayTrigger>
            </Column>

            {subRoute == "alunos"
              ? <>
                <Column>
                  <CopyToClipboard text={enrollment} />
                </Column>
                <WorkloadProgressBars workloadCount={user?.workloadCount} />
              </>
              : <>
                <Column>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip>{user?.email}</Tooltip>}>
                    <span>{user?.email}</span>
                  </OverlayTrigger>
                </Column>

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
              </>
            }

            <Column>
              <UserStatus status={user?.isActive}>{user?.isActive === true ? "Ativo" : "Inativo"}</UserStatus>
            </Column>

            {user && !disableMenu
              ? (
                <Dropdown align="end" onClick={(e) => handleDropdown(e)} onMouseLeave={() => setConfirmDanger(false)}>
                  <Options variant="secondary">
                    <i className="bi bi-three-dots-vertical" />
                  </Options>

                  <DropdownMenu renderOnMount={true}>
                    <DropdownItem onClick={() =>
                      toggleModalForm(
                        `Editar usuário (${getFirstAndLastName(user?.name)})`,
                        <FormAddUser user={user} />,
                        "lg"
                      )
                    } accent={"var(--success)"}>
                      <i className="bi bi-pencil-fill"></i> Editar
                    </DropdownItem>
                    <DropdownItem onClick={() =>
                      toggleModalForm(
                        `Resetar senha (${getFirstAndLastName(user?.name)})`,
                        <FormSendPasswordResetLink user={user} />,
                        "md"
                      )
                    } accent={"var(--success)"}>
                      <i className="bi bi-key-fill"></i> Resetar senha
                    </DropdownItem>

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
        )
  );
}