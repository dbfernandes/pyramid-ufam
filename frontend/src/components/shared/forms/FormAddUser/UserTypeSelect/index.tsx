import { useEffect } from "react";

// Custom
import UserTypeCard from "components/shared/cards/UserTypeCard";
import {
  Wrapper,
  CardGroup
} from "./styles";

// Interfaces
interface IUserTypeSelectProps {
  userTypeId: number | null;
  setUserTypeId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function UserTypeSelect({
  userTypeId,
  setUserTypeId,
}: IUserTypeSelectProps) {
  const userTypes = [
    {
      id: 3,
      name: "Aluno",
    },
    {
      id: 2,
      name: "Secretário",
    },
    {
      id: 1,
      name: "Coordenador",
    }
  ];

  /*useEffect(() => {
    if (userType)
      document
        .getElementById("name")!
        .scrollIntoView({ behavior: "smooth" });
  }, [userType]);*/

  return (
    <Wrapper>
      <p>Qual tipo de usuário você deseja adicionar?</p>

      <CardGroup>
        {userTypes.map((_userType) => (
          <UserTypeCard
            key={_userType.id}
            userType={_userType}
            onClick={() => setUserTypeId(_userType.id)}
            marked={userTypeId !== null && (userTypeId === _userType.id)}
            blurred={userTypeId !== null && (userTypeId !== _userType.id)}
          />
        ))}
      </CardGroup>
    </Wrapper>
  );
}