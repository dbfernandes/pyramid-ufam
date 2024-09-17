import { useState } from "react";
import { Collapse, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getFirstAndLastName } from "utils";

// Shared
import CopyToClipboard from "components/shared/Table/CopyToClipboard";
import toggleModalForm from "components/shared/ModalForm";
import FormUpdateAccount from "components/shared/forms/FormUpdateAccount";
import EnrollmentList from "components/shared/EnrollmentList";
import FormSendPasswordResetLink from "components/shared/forms/FormSendPasswordResetLink";
import Spinner from "components/shared/Spinner";
import {
  ProgressBar,
  ItemWrapper,
  Column,

  CustomFormCheck,
  CheckboxPreventClick,

  DropdownMenu,
  DropdownItem,
  Options,

  UserProfilePicture,
  ToggleButton
} from "components/shared/Table";

// Custom
import CollapseDetails from "./CollapseDetails";
import UserCourses from "./UserCourse";
import Workload from "./Workload";
import {
  CustomItem,
  UserStatus,
} from "./styles";

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

export function getMoreInfo(user, courseId) {
  function getEnrollment(user, courseId) {
    const course = user?.courses.find((course) => course.id === courseId);
    if (!course?.enrollment) return "-";
    return course?.enrollment;
  }

  const selectedCourse = user?.courses.find((course) => course.id === courseId);
  const minWorkload = selectedCourse?.minWorkload || 0;
  const workloadCount = selectedCourse?.workloadCount;
  const totalWorkload = workloadCount?.totalWorkload || 0;
  const hoursRemaining = minWorkload - totalWorkload;
  const enrollment = getEnrollment(user, courseId);
  const isComplete = hoursRemaining <= 0;

  return { selectedCourse, workloadCount, minWorkload, totalWorkload, hoursRemaining, enrollment, isComplete };
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

  // More details
  const more = getMoreInfo(user, courseId);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    header
      ? (
        <CustomItem header={true} student={subRoute === "alunos"}>
          <CustomFormCheck
            id="check-all"
            inline
            name="users"
            value={"all"}
            label={""}
            onClick={(e) => handleCheck(e)}
          />
          <div />
          <Column header={true} sortBy={"name"}>Nome</Column>
          {subRoute == "alunos"
            ? <>
              <Column header={true} hideOnMobile={true} sortBy={"enrollment"}>Matrícula</Column>
              <Column header={true} hideOnMobile={true} sortBy={"education"} isNumeric={true}>Horas (Ensino)</Column>
              <Column header={true} hideOnMobile={true} sortBy={"research"} isNumeric={true}>Horas (Pesquisa)</Column>
              <Column header={true} hideOnMobile={true} sortBy={"extension"} isNumeric={true}>Horas (Extensão)</Column>
              <Column header={true} sortBy={"total"} isNumeric={true}>Total</Column>
              <Column header={true} hideOnMobile={true}>Status</Column>
            </>
            : <>
              <Column header={true} hideOnMobile={true} sortBy={"email"}>Email</Column>
              <Column header={true} hideOnMobile={true}>Curso(s)</Column>
            </>
          }
        </CustomItem>
      ) : loading
        ? (
          <ItemWrapper>
            <CustomItem student={subRoute === "alunos"}>
              <div />
              {Array.from(Array(subRoute === "alunos" ? 5 : 3).keys()).map((i) =>
                <Column key={i} loading={true} />
              )}
              <div />
              <div />
            </CustomItem>
          </ItemWrapper>
        ) : (
          <ItemWrapper>
            <CustomItem
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

              <Column tooltip={user?.name}>{user?.name}</Column>

              {subRoute == "alunos"
                ? <>
                  <Column hideOnMobile={true}>
                    <CopyToClipboard text={more.enrollment} />
                  </Column>
                  <Workload workloadCount={more.workloadCount} />
                  <ProgressBar current={more.totalWorkload} max={more.minWorkload} />
                </>
                : <>
                  <Column hideOnMobile={true} tooltip={user?.email}>
                    {user?.email}
                  </Column>
                  <Column hideOnMobile={true}>
                    <UserCourses user={user} />
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
            </CustomItem>

            <Collapse in={collapsed}>
              <div>
                <CollapseDetails user={user} />
              </div>
            </Collapse>
          </ItemWrapper>
        )
  );
}