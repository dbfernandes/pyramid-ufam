
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import confirm from "components/shared/ConfirmModal";
import { logout, defaultCourse } from "redux/slicer/user";
import { getFirstName } from "utils";

// Custom
import {
  Wrapper,
  UserName,
  UserRole,
  UserGroup,
  Logoff,
  ChangeCourse,
  UserPic,
} from "./styles";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import { UserTypes } from "constants/userTypes.constants";

// Interfaces
interface IUserInfoProps {
  isMobile?: boolean;
}

export default function UserInfo({ isMobile = false }: IUserInfoProps) {
  const dispatch = useDispatch();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);

  function handleChangeCourse() {
    dispatch(defaultCourse(null));
  }

  return (
    <Wrapper>
      <UserName>
        <UserPic>
          <img
            src={user?.profileImage && user?.profileImage.length > 0
              ? user?.profileImage
              : `${process.env.basePath}/img/user.png`
            }
            alt={user?.name}
            onError={({ currentTarget }) => {
              currentTarget.src = `${process.env.basePath}/img/user.png`;
            }}
          />
        </UserPic>

        <p>{isMobile ? getFirstName(user.name) : user.name}</p>

        {!isMobile &&
          <UserRole>{UserTypes[user.userTypeId]}</UserRole>
        }

        <OverlayTrigger placement="left" overlay={<Tooltip>Sair</Tooltip>}>
          <Logoff
            onClick={() =>
              confirm(
                () => dispatch(logout()),
                "Tem certeza que deseja sair?",
                "Sair",
                ""
              )
            }>
            <i className="bi bi-box-arrow-right" />
          </Logoff>
        </OverlayTrigger>
      </UserName>

      {(!isMobile && user.selectedCourse) && (
        <UserGroup>
          {user.selectedCourse?.name}

          <OverlayTrigger
            placement="left"
            overlay={<Tooltip>Trocar de curso</Tooltip>}
          >
            <ChangeCourse onClick={() => handleChangeCourse()}>
              <i className="bi bi-arrow-left-right" />
            </ChangeCourse>
          </OverlayTrigger>
        </UserGroup>
      )}
    </Wrapper>
  );
}
