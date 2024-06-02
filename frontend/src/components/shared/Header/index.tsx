import { useState } from "react";

// Shared
import Sidenav from "components/shared/Sidenav";
import { Burger } from "components/shared/Sidenav/styles";

// Custom
import Breadcrumb from "./Breadcrumb";
import UserInfo from "./UserInfo";
import {
  HeaderMobile,
  Wrapper,
  Logo,
  SidenavWrapper,
  SidenavBackground
} from "./styles";

// Interfaces
interface IHeaderProps {
  isMobile: boolean;
}

export default function Header({ isMobile }: IHeaderProps) {
  const [showSidenav, setShowSidenav] = useState<boolean>(false);
  return (
    <div>
      {isMobile &&
        <>
          <HeaderMobile>
            <div>
              <Burger style={{ justifySelf: "flex-end" }} onClick={() => setShowSidenav(true)} aria-expanded={showSidenav}>
                <i className={"bi bi-list"} />
              </Burger>

              <Logo src={`${process.env.basePath}/img/full-logo.png`} />
            </div>

            <UserInfo isMobile />
          </HeaderMobile>

          <SidenavWrapper show={showSidenav}>
            <div>
              <div className={"buttonWrapper"}>
                <button
                  className={"close"}
                  onClick={() => setShowSidenav(false)}>
                  <i className={"bi bi-x-lg"} />
                </button>
              </div>

              <Sidenav isMobile={true} />
            </div>
          </SidenavWrapper>

          {showSidenav
            ? <SidenavBackground onClick={() => setShowSidenav(false)} show={showSidenav} />
            : null
          }
        </>
      }

      <Wrapper>
        <div>
          <Breadcrumb isMobile />
          {!isMobile && <UserInfo />}
        </div>
      </Wrapper>
    </div>
  )
}