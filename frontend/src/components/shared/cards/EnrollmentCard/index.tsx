import { useState } from "react";
import { useSelector } from "react-redux";

// Shared
import { H4 } from "components/shared/Titles";
import toggleModalForm from "components/shared/ModalForm";
import FormLinkCourse from "components/shared/forms/FormLinkCourse";

// Custom
import {
  Wrapper,
  UnstyledButton,
  DropdownWrapper,
  DropdownMenu,
  DropdownItem,
  Options,
  Marker,
} from "./styles";

// Interfaces
import ICourse from "interfaces/ICourse";
import IUserLogged from "interfaces/IUserLogged";
import { UserTypes } from "constants/userTypes.constants";
import IUser from "interfaces/IUser";

interface ICourseCard {
  course: ICourse;
  editable?: boolean;
  marked?: boolean;
  blurred?: boolean;
  onClick?: Function;
  onDelete?: Function;
  onChange?: Function;
  handleCloseModalForm?: Function;
  user: IUserLogged | IUser;
  children?: React.ReactNode;
}

export default function EnrollmentCard({
  course,
  editable = true,
  marked = false,
  blurred = false,
  onClick,
  onDelete = () => { },
  onChange,
  handleCloseModalForm,
  user,
  children,
}: ICourseCard) {
  function handleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function CardBody({ course, editable, marked, blurred, onDelete, onChange, handleCloseModalForm, user, children }: ICourseCard) {
    const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false);
    //const user = useSelector<IRootState, IUserLogged>(state => state.user);

    const isStudent = UserTypes[user?.userTypeId] == "Aluno(a)";

    function handleDeletion(e) {
      e.preventDefault();
      e.stopPropagation();
      setConfirmDeletion(!confirmDeletion);

      if (confirmDeletion && onDelete) {
        onDelete();
      }
    }

    return (
      <Wrapper marked={marked} blurred={blurred} onMouseLeave={() => setConfirmDeletion(false)}>
        <H4>{course.name}</H4>

        {isStudent && <p>Matrícula: {course?.enrollment}</p>}
        {children}
        {course.id && editable && (
          <DropdownWrapper align="end" onClick={(e) => handleDropdown(e)}>
            <Options variant="secondary">
              <i className="bi bi-three-dots-vertical" />
            </Options>

            <DropdownMenu renderOnMount={true}>
              {isStudent && (
                <DropdownItem
                  onClick={() =>
                    toggleModalForm(
                      `Alterar matrícula (${course.name})`,
                      <FormLinkCourse user={user} course={course} onChange={onChange} handleCloseModalForm={handleCloseModalForm} onEditSuccess={handleCloseModalForm} />,
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
          </DropdownWrapper>
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
      <CardBody
        course={course}
        editable={editable}
        marked={marked}
        blurred={blurred}
        user={user}
        onDelete={onDelete}
        onChange={onChange}
        handleCloseModalForm={handleCloseModalForm}
      />
    </UnstyledButton>
  ) : (
    <CardBody
      course={course}
      editable={editable}
      marked={marked}
      blurred={blurred}
      user={user}
      onDelete={onDelete}
      onChange={onChange}
      handleCloseModalForm={handleCloseModalForm}
    />
  );
}
