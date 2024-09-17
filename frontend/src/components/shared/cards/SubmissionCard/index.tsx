import { useState } from "react";
import Collapse from 'react-bootstrap/Collapse';
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Shared
import {
  Column,
  CustomFormCheck,
  CheckboxPreventClick,
  ItemWrapper,
  ToggleButton,
  UserProfilePicture
} from "components/shared/Table";

// Custom
import SubmissionStatus from "./SubmissionStatus";
import CollapseDetails from "./CollapseDetails";
import {
  CustomItem,
} from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
interface ISubmissionCardProps {
  submission?: any;
  loading?: boolean;
  header?: boolean;
  checkedIds?: number[];
  setCheckedIds?: React.Dispatch<React.SetStateAction<number[]>>;
  userLogged?: IUserLogged;
  onChange?: Function;
}

export default function SubmissionCard({
  submission = null,
  loading = false,
  header = false,
  checkedIds = [],
  setCheckedIds = () => { },
  userLogged,
  onChange = () => { },
  ...props
}: ISubmissionCardProps) {
  const isAdmin = userLogged?.userTypeId !== 3;
  const [collapsed, setCollapsed] = useState<boolean>(false);

  function handleCheck(e) {
    e.stopPropagation();

    let allValues = [];
    const checks = document.getElementsByName("submissions");

    checks.forEach((check) => {
      if ("value" in check && check.value != "all") {
        let _value = parseInt(check.value as string) as never;
        allValues.push(_value);
      }
    });

    if (e.target.value != "all") {
      const value = parseInt(e.target.value);
      const index = checkedIds.indexOf(value);

      // Hardcopying the array
      let _checkedIds = JSON.parse(JSON.stringify(checkedIds));

      if (e.target.checked && index === -1) {
        _checkedIds.push(value);
      } else if (!e.target.checked && index !== -1) {
        _checkedIds.splice(index, 1);
      }

      setCheckedIds(_checkedIds);

      const checkboxAll = document.getElementById("check-all");
      if (checkboxAll != null && "checked" in checkboxAll) {
        checkboxAll.checked = JSON.stringify(_checkedIds.sort()) === JSON.stringify(allValues);
      }
    } else {
      checks.forEach((check) => {
        if ("checked" in check) {
          check["checked"] = e.target.checked;
        }
      });

      setCheckedIds(e.target.checked ? allValues : []);
    }
  }

  const activityGroupsIcons = {
    ens: "person-video3",
    pes: "search",
    ext: "lightbulb",
  };

  return header ? (
    <CustomItem header={true} admin={isAdmin}>
      <CustomFormCheck
        id="check-all"
        inline
        name="submissions"
        value={"all"}
        label={""}
        onClick={(e) => handleCheck(e)}
      />
      {isAdmin &&
        <>
          <div />
          <Column header={true} sortBy={"name"}>Aluno</Column>
        </>
      }
      <Column header={true} hideOnMobile={true} sortBy={"description"}>Descrição</Column>
      <Column header={true} hideOnMobile={true} sortBy={"activity-group"}>Grupo</Column>
      <Column header={true} hideOnMobile={true} sortBy={"activity-name"}>Atividade</Column>
      <Column header={true} hideOnMobile={true} sortBy={"workload"} isNumeric={true}>Horas solicitadas</Column>
      <Column header={true}>Status</Column>
      <div />
    </CustomItem>
  ) : loading ? (
    <ItemWrapper>
      <CustomItem admin={isAdmin}>
        <div /> {/* Checkbox */}

        {isAdmin && <>
          {/* User profile picture and name */}
          <div />
          <Column loading={true} />
        </>}

        {/* Description */}
        {Array.from(Array(5).keys()).map((i) =>
          <Column loading={true} />
        )}

        <div /> {/* Options */}
      </CustomItem>
    </ItemWrapper>
  ) : (
    <ItemWrapper>
      <CustomItem
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={collapsed}
        collapsed={collapsed}
        admin={isAdmin}>
        <CustomFormCheck
          inline
          name="submissions"
          value={submission?.id.toString()}
          label={
            <CheckboxPreventClick
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          }
          onClick={(e) => handleCheck(e)}
        />

        {isAdmin && <>
          <UserProfilePicture
            src={
              submission?.user?.profileImage && submission?.user?.profileImage.length > 0
                ? submission?.user?.profileImage
                : `${process.env.img}/user.png`
            }
            alt={submission?.user?.name}
            onError={({ currentTarget }) => {
              currentTarget.src = `${process.env.img}/user.png`;
            }}
          />

          <Column tooltip={submission?.user?.name}>
            {submission?.user?.name}
          </Column>
        </>

        }

        <Column hideOnMobile={isAdmin} tooltip={submission?.description}>
          {submission?.description}
        </Column>

        <Column hideOnMobile={true}>
          <i
            className={`bi bi-${activityGroupsIcons[submission?.activity.activityGroup.name.toLowerCase().slice(0, 3)]}`}
          />
          {submission?.activity.activityGroup.name}
        </Column>

        <Column hideOnMobile={true} tooltip={submission?.activity.name}>
          {submission?.activity.name}
        </Column>

        <Column hideOnMobile={true}>
          {submission?.workload}h
        </Column>

        <Column>
          <SubmissionStatus status={submission?.status} />
        </Column>

        <ToggleButton expanded={collapsed}>
          <i className={`bi bi-chevron-${collapsed ? "up" : "down"}`}></i>
        </ToggleButton>
      </CustomItem>
      <Collapse in={collapsed}>
        <div>
          <CollapseDetails submission={submission} userLogged={userLogged} onChange={onChange} />
        </div>
      </Collapse>
    </ItemWrapper>
  );
}
