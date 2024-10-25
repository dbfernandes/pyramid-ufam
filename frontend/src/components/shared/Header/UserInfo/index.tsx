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
import { useTheme } from "../../../../../src/contexts/ThemeContext"; // Importando o hook do tema

// Interfaces
interface IUserInfoProps {
  isMobile?: boolean;
}

const UserInfo: React.FC<IUserInfoProps> = ({ isMobile = false }) => {
  const dispatch = useDispatch();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const { isLightTheme, toggleTheme } = useTheme(); // Usando o contexto

  const handleChangeCourse = () => {
    dispatch(defaultCourse(null));
  };

  return (
    <Wrapper>
      <UserName>
        <UserPic>
          <img
            src={user?.profileImage && user?.profileImage.length > 0
              ? user?.profileImage
              : `${process.env.img}/user.png`
            }
            alt={user?.name}
            onError={({ currentTarget }) => {
              currentTarget.src = `${process.env.img}/user.png`;
            }}
          />
        </UserPic>

        <p>{isMobile ? getFirstName(user.name) : user.name}</p>

        {!isMobile && <UserRole>{UserTypes[user.userTypeId]}</UserRole>}

        <i
          className={`bi ${isLightTheme ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}
          style={{ margin: "0 13px", cursor: "pointer" }}
          onClick={toggleTheme}
        />

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
            <ChangeCourse onClick={handleChangeCourse}>
              <i className="bi bi-arrow-left-right" />
            </ChangeCourse>
          </OverlayTrigger>
        </UserGroup>
      )}
    </Wrapper>
  );
}

export default UserInfo;
