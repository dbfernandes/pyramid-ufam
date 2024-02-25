import { useDispatch, useSelector } from "react-redux";
import { defaultCourse } from "redux/slicer/user";

// Custom
import {
  Wrapper,
  UserPic,
  UserName,
  UserRoleWrapper,
  UserRole,
  UserGroup,
} from "./styles";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import { UserTypes } from "constants/userTypes.constants";

export default function UserInfoMobile() {
  const dispatch = useDispatch();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);

  function handleChangeCourse() {
    dispatch(defaultCourse(null));
  }

  return (
    <Wrapper>
      <UserPic>
        <img src={user.profileImage && user.profileImage.length > 0
          ? `${process.env.REACT_APP_API_URL}/files/${user.profileImage}`
          : `${process.env.basePath}/img/user.png`
        } alt={user.name} />
      </UserPic>
      <UserName>{user.name}</UserName>

      <UserRoleWrapper>
        <UserRole>{UserTypes[user.userTypeId]}</UserRole>
        {(user.selectedCourse) && (
          <UserGroup>
            {user.selectedCourse?.name}
          </UserGroup>
        )}
      </UserRoleWrapper>
    </Wrapper>
  );
}
