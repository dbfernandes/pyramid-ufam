import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getToken } from "utils";

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
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

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
    const user = useSelector<IRootState, IUserLogged>((state) => state.user);
    const [users, setUsers] = useState<any[]>([]);
    const [fetchingUsers, setFetchingUsers] = useState<boolean>(true);
    const [totalActiveUsers, setTotalActiveUsers] = useState<number>(0);

    useEffect(() => {
      if (user?.logged && course.id) {
        fetchUsers(0, "", "active", course.id);
      }
    }, [user?.logged, course.id]);

    async function fetchUsers(_page, _search, _status, courseId) {
      setFetchingUsers(true);

      const options = {
        url: `${process.env.api}/users?type=aluno&search=${_search}&courseId=${courseId}&status=${_status}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        },
      };

      try {
        if (user.userTypeId !== 3) {
          const response = await axios.request(options as AxiosRequestConfig);
          const filteredUsers = response.data.users.filter(u => u.email !== user.email);
          setUsers(filteredUsers);

          const activeUsers = filteredUsers.filter(u => u.isActive);
          setTotalActiveUsers(activeUsers.length);
        }
      } catch (error) {
        handleFetchError(error);
      }

      setFetchingUsers(false);
    }

    function handleFetchError(error) {
      const errorMessages = {
        0: "Oops, tivemos um erro. Tente novamente.",
        500: error?.response?.data?.message,
      };
      const code = error?.response?.status ? error.response.status : 500;
      toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
    }

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
            {totalActiveUsers > 0
              ? `${totalActiveUsers} alunos`
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
