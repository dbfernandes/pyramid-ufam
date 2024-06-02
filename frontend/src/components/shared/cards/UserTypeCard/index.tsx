import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import Link from "next/link";

// Shared
import { H4 } from "components/shared/Titles";

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
import { UserTypeIcons } from "constants/userTypeIcons.constants";

// Interfaces
export interface IUserType {
  name: string;
}

interface IUserTypeCard {
  userType: IUserType;
  link?: string;
  onClick?: Function;
  marked?: boolean;
  blurred?: boolean;
}

export default function UserTypeCard({
  userType,
  link,
  onClick,
  marked = false,
  blurred = false,
}: IUserTypeCard) {
  function CardBody({ userType, marked, blurred }: IUserTypeCard) {
    return (
      <Wrapper marked={marked} blurred={blurred}>
        <H4>{<i className={`bi bi-${UserTypeIcons[userType.name]}`} />}{userType.name}</H4>

        {marked && (
          <Marker>
            <i className="bi bi-check2" />
          </Marker>
        )}
      </Wrapper>
    );
  }

  return link ? (
    <Link href={link} passHref>
      <UnstyledLink>
        <CardBody userType={userType} marked={marked} blurred={blurred} />
      </UnstyledLink>
    </Link>
  ) : onClick ? (
    <UnstyledButton onClick={onClick} type="button">
      <CardBody userType={userType} marked={marked} blurred={blurred} />
    </UnstyledButton>
  ) : (
    <CardBody userType={userType} marked={marked} blurred={blurred} />
  );
}
