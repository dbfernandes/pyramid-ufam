import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import Link from "next/link";
import { useSelector } from "react-redux";

// Shared
import { H4 } from "components/shared/Titles";
import toggleModalForm from "components/shared/ModalForm";
import FormLinkCourse from "components/shared/forms/FormLinkCourse";

// Custom
import {
  Wrapper,
  UnstyledButton,
  UnstyledLink,
  HoverMenu,
  DropdownMenu,
  DropdownItem,
  Options,
  Marker,
} from "./styles";

// Interfaces
import ICourse from "interfaces/ICourse";
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import { UserTypes } from "constants/userTypes.constants";

interface ICourseCard {
  course: ICourse;
  onClick?: Function;
  onDelete?: Function;
  editable?: boolean;
  marked?: boolean;
  blurred?: boolean;
  children?: React.ReactNode;
}

export default function EnrollmentCard({
  course,
  onClick,
  onDelete = () => { },
  editable = true,
  marked = false,
  blurred = false,
  children,
}: ICourseCard) {
  function handleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function CardBody({ course, marked, blurred }: ICourseCard) {
    const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false);
    const user = useSelector<IRootState, IUserLogged>((state) => state.user);
    const isStudent = UserTypes[user.userTypeId] == "Aluno(a)";

    function handleDeletion(e) {
      e.preventDefault();
      e.stopPropagation();
      setConfirmDeletion(!confirmDeletion);

      if (confirmDeletion) {
        onDelete();
      }
    }

    return (
      <Wrapper marked={marked} blurred={blurred}>
        <H4>{course.name}</H4>

        {isStudent && <p>Matrícula: {course?.enrollment}</p>}
        {children}
        {course.id && editable && (
          <HoverMenu onMouseLeave={() => setConfirmDeletion(false)}>
            <Dropdown align="end" onClick={(e) => handleDropdown(e)}>
              <Options variant="secondary">
                <i className="bi bi-gear-fill" />
              </Options>

              <DropdownMenu renderOnMount={true}>
                {isStudent && (
                  <DropdownItem
                    onClick={() =>
                      toggleModalForm(
                        `Alterar matrícula (${course.name})`,
                        <FormLinkCourse user={user} course={course} />,
                        "md"
                      )
                    }
                    accent={"var(--success)"}>
                    <i className="bi bi-pencil-fill"></i> Alterar matrícula
                  </DropdownItem>
                )}
                <DropdownItem
                  onClick={(e) => handleDeletion(e)}
                  accent={"var(--danger)"}>
                  {confirmDeletion ? (
                    <>
                      <i className="bi bi-exclamation-circle-fill"></i>{" "}
                      Confirmar
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash-fill"></i> Remover
                    </>
                  )}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </HoverMenu>
        )}

        {marked && (
          <Marker>
            <i className="bi bi-check2" />
          </Marker>
        )}
      </Wrapper>
    );
  }

  return onClick ? (
    <UnstyledButton onClick={onClick} type="button">
      <CardBody course={course} marked={marked} blurred={blurred} />
    </UnstyledButton>
  ) : (
    <CardBody course={course} marked={marked} blurred={blurred} />
  );
}
