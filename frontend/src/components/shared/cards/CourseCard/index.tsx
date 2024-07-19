import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import Link from "next/link";

// Shared
import { H4 } from "components/shared/Titles";
import toggleModalForm from "components/shared/ModalForm";
import FormEditCourse from "components/shared/forms/FormAddCourse";

// Custom
import {
  Wrapper,
  HoverMenu,
  DropdownMenu,
  DropdownItem,
  Options,
  Marker,
} from "./styles";

// Interfaces
import ICourse from "interfaces/ICourse";
interface ICourseCard {
  course: ICourse;
  link?: string;
  editable?: boolean;
  marked?: boolean;
  blurred?: boolean;

  onDelete?: Function;
  onChange?: Function;

  children?: React.ReactNode;
}

export default function CourseCard({
  course,
  link,
  editable = true,
  marked = false,
  blurred = false,

  onDelete = () => { },
  onChange = () => { },

  children,
}: ICourseCard) {
  function handleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function CardBody({ course, marked, blurred }: ICourseCard) {
    const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false);

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
        <div>
          <H4>{course.name}</H4>
          <span>
            {course.userCount && course.userCount > 0
              ? `${course.userCount} alunos`
              : "Sem alunos"
            }
          </span>
        </div>
        <p>Código: {course?.code}</p>
        <p>Períodos: {course?.periods}</p>

        {children}

        {course.id && editable && (
          <HoverMenu onMouseLeave={() => setConfirmDeletion(false)}>
            <Dropdown align="end" onClick={(e) => handleDropdown(e)}>
              <Options variant="secondary">
                <i className="bi bi-gear-fill" />
              </Options>

              <DropdownMenu renderOnMount={true}>
                <DropdownItem
                  onClick={() =>
                    toggleModalForm(
                      `Editar curso (${course.name})`,
                      <FormEditCourse course={course} onChange={onChange} />,
                      "md"
                    )
                  }
                  accent={"var(--success)"}>
                  <i className="bi bi-pencil-fill"></i> Editar
                </DropdownItem>
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

  return link ? (
    <Link href={link}>
      <a>
        <CardBody course={course} marked={marked} blurred={blurred} />
      </a>
    </Link>
  ) : (
    <CardBody course={course} marked={marked} blurred={blurred} />
  );
}
