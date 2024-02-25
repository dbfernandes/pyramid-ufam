import { useState } from "react";
import {
  PencilFill,
  MortarboardFill,
  KeyFill
} from "react-bootstrap-icons";

// Shared
import FormUpdateAccount from "components/shared/forms/FormUpdateAccount";
import EnrollmentList from "components/shared/EnrollmentList";

// Custom
import {
  AccountMenuWrapper,
  CustomSidenav,
  CustomLinkWrapper,
  CustomSidenavButton
} from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import FormSendPasswordResetLink from "components/shared/forms/FormSendPasswordResetLink";
interface IAccountMenuProps {
  user: IUserLogged;
}

export default function AccountMenu({ user }: IAccountMenuProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    {
      icon: <PencilFill />,
      title: "Alterar informações pessoais",
      component: <FormUpdateAccount user={user} />
    },
    {
      icon: <MortarboardFill />,
      title: "Cursos vinculados",
      component: <EnrollmentList user={user} />
    },
    {
      icon: <KeyFill />,
      title: "Alterar senha",
      component: <FormSendPasswordResetLink user={user} />
    },
  ];

  return (
    <AccountMenuWrapper>
      <CustomSidenav sidenavOpen={true}>
        <CustomLinkWrapper sidenavOpen={true}>
          <div>
            {tabs.map((tab, index) =>
              <CustomSidenavButton
                key={index}
                active={activeTab === index}
                onClick={() => setActiveTab(index)}>
                {tab.icon}
                <span>{tab.title}</span>
              </CustomSidenavButton>
            )}
          </div>
        </CustomLinkWrapper>
      </CustomSidenav>

      <div>
        {tabs[activeTab].component}
      </div>
    </AccountMenuWrapper>
  );
}