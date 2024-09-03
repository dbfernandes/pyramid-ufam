import { useState } from "react";
import Link from "next/link";

// Shared
import { H4 } from "components/shared/Titles";
import toggleModalForm from "components/shared/ModalForm"
import FormAddActivity from "components/shared/forms/FormAddActivity";

// Custom
import {
  Wrapper,
  UnstyledButton,
  UnstyledLink,
  DropdownWrapper,
  DropdownMenu,
  DropdownItem,
  Options,
  Marker,
} from "./styles";
import { GroupIcons } from "constants/groupIcons.constants.";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
export interface IActivity {
  id?: number;
  name: string;
  description?: string;
  maxWorkload?: number;
}

interface IActivityCard {
  activity: IActivity;
  userLogged: IUserLogged;
  groupSlug?: string;
  link?: string;
  onClick?: Function;
  editable?: boolean;
  marked?: boolean;
  blurred?: boolean;

  onDelete?: Function;
  onChange?: Function;

  children?: React.ReactNode;
}

export default function ActivityCard({
  activity,
  userLogged,
  groupSlug = "",
  link,
  onClick,
  editable = true,
  marked = false,
  blurred = false,

  onDelete = () => { },
  onChange = () => { },

  children,
}: IActivityCard) {
  function handleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function CardBody({ activity, userLogged, marked, blurred, groupSlug }: IActivityCard) {
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
      <Wrapper marked={marked} blurred={blurred} onMouseLeave={() => setConfirmDeletion(false)}>
        <div style={editable ? { width: "calc(100% - 22px)" } : {}}>
          <H4>{activity.name in GroupIcons && <i className={`bi bi-${GroupIcons[activity.name]}`} />}{activity.name}</H4>
          {activity.maxWorkload && <span>{activity.maxWorkload}h</span>}
        </div>

        {activity.description?.length != 0 &&
          activity.description
            ?.split("\n")
            .map((_description) => <p>{_description}</p>)}
        {children}

        {activity.id && editable && (
          <DropdownWrapper align="end" onClick={(e) => handleDropdown(e)}>
            <Options variant="secondary">
              <i className="bi bi-three-dots-vertical" />
            </Options>

            <DropdownMenu renderOnMount={true}>
              {groupSlug &&
                <DropdownItem
                  onClick={() =>
                    toggleModalForm(
                      `Editar curso (${activity.name})`,
                      <FormAddActivity userLogged={userLogged} activity={activity} groupSlug={groupSlug} onChange={onChange} />,
                      "md"
                    )
                  }
                  accent={"var(--success)"}>
                  <i className="bi bi-pencil-fill"></i> Editar
                </DropdownItem>}
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

  return link ? (
    <Link href={link} passHref>
      <UnstyledLink>
        <CardBody activity={activity} userLogged={userLogged} marked={marked} blurred={blurred} groupSlug={groupSlug} />
      </UnstyledLink>
    </Link>
  ) : onClick ? (
    <UnstyledButton onClick={onClick} type="button">
      <CardBody activity={activity} userLogged={userLogged} marked={marked} blurred={blurred} groupSlug={groupSlug} />
    </UnstyledButton>
  ) : (
    <CardBody activity={activity} userLogged={userLogged} marked={marked} blurred={blurred} groupSlug={groupSlug} />
  );
}
