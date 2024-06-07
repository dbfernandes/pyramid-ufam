import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout, defaultCourse } from "redux/slicer/user";

// Shared
import confirm from "components/shared/ConfirmModal";
import UserInfoMobile from "components/shared/Header/UserInfo/UserInfoMobile";

// Custom
import SidenavButton from "./SidenavButton";
import {
  Wrapper,
  LogoWrapper,
  Logo,
  Burger,
  LinkWrapper,
  SidenavLink,
  NestedIcon
} from "./styles";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface ISidenavProps {
  isMobile?: boolean;
  sidenavOpen?: boolean;
  setSidenavOpen?: (value: boolean) => void;
}

export default function Sidenav({ isMobile = false, sidenavOpen = true, setSidenavOpen = () => { } }: ISidenavProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);

  useEffect(() => {
    setSidenavOpen(true);
  }, []);

  const [displayLinkTitles, setDisplayLinkTitles] = useState<boolean>(true);
  function toggleSidenavOpen() {
    if (sidenavOpen) {
      setSidenavOpen(false);
      setDisplayLinkTitles(false);
    } else {
      setSidenavOpen(true)
      setTimeout(() => setDisplayLinkTitles(true), 120);
    }
  }

  const buttonGroups = [
    {
      title: null,
      links: [
        {
          icon: <i className="bi bi-file-earmark-bar-graph" />,
          title: "Painel",
          route: "/painel",
        },
        {
          icon: <i className="bi bi-person" />,
          title: "Minha conta",
          route: "/conta",
        },
        {
          icon: <i className="bi bi-arrow-left-right" />,
          title: "Trocar de curso",
          onClick: () => dispatch(defaultCourse(null)),
        },
        {
          icon: <i className="bi bi-box-arrow-right" />,
          title: "Sair",
          onClick: () =>
            confirm(
              () => dispatch(logout()),
              "Tem certeza que deseja sair?",
              "Sair",
              ""
            ),
        },
      ],
    },
    {
      title: "Contagem de Horas",
      links: [
        {
          icon: <i className="bi bi-file-earmark-plus" />,
          title: "Nova submissão",
          route: "/minhas-solicitacoes/nova",
          permissions: [3],
        },
        {
          icon: <i className="bi bi-list-check" />,
          title: "Minhas submissões",
          route: "/minhas-solicitacoes",
          permissions: [3],
        },
        {
          icon: <NestedIcon>
            <i className="bi bi-list-check" />
            <i className="bi bi-file-earmark-medical-fill" />
          </NestedIcon>,
          title: "Submissões do curso",
          route: "/solicitacoes",
          permissions: [1, 2],
        },
        {
          icon: <NestedIcon>
            <i className="bi bi-list-check" />
            <i className="bi bi-grid-fill" />
          </NestedIcon>,
          title: "Submissões por grupo de atividade",
          route: "/solicitacoes/grupo-atividade",
          permissions: [1, 2]
        }
      ],
    },
    {
      title: "Usuários",
      links: [
        {
          icon: <i className="bi bi-person-plus" />,
          title: "Adicionar usuário",
          route: "/usuarios/novo",
        },
        {
          icon: <i className="bi bi-person-workspace" />,
          title: "Coordenadores",
          route: "/usuarios/coordenadores",
        },
        {
          icon: <i className="bi bi-person-badge" />,
          title: "Secretários",
          route: "/usuarios/secretarios",
        },
        {
          icon: <i className="bi bi-people" />,
          title: "Alunos",
          route: "/usuarios/alunos",
        },
      ],
      permissions: [1],
    },
    {
      title: "Cursos",
      links: [
        {
          icon: <i className="bi bi-mortarboard-fill" />,
          title: "Listagem de cursos",
          route: "/cursos",
        },
      ],
      permissions: [1],
    },
    {
      title: "Atividades do curso",
      links: [
        {
          icon: <i className="bi bi-person-video3" />,
          title: "Ensino",
          route: "/atividades/ensino",
        },
        {
          icon: <i className="bi bi-search" />,
          title: "Pesquisa",
          route: "/atividades/pesquisa",
        },
        {
          icon: <i className="bi bi-lightbulb" />,
          title: "Extensão",
          route: "/atividades/extensao",
        },
      ],
      permissions: [1],
    },
  ];

  function checkPermission(option, userTypeId) {
    return "permissions" in option
      ? "permissions" in option && option.permissions.includes(userTypeId)
      : true;
  }

  function getAbsoluteRoute() {
    const route = router.pathname.replace("/[id]", "").replace("/[group]", "");

    if (router.pathname.includes("/atividades")) {
      return `${route}/${router.query.group}`;
    }

    return route;
  }

  return (
    <Wrapper sidenavOpen={sidenavOpen}>
      <div>
        {!isMobile &&
          <LogoWrapper>
            {sidenavOpen && <Logo src={`${process.env.basePath}/img/full-logo.png`} />}
            <Burger
              onClick={() => toggleSidenavOpen()}>
              <i className={"bi bi-list"} />
            </Burger>
          </LogoWrapper>
        }

        {isMobile && <UserInfoMobile />}

        {buttonGroups.length > 0 &&
          buttonGroups.map(
            (group, index) =>
              checkPermission(group, user.userTypeId) && (
                <LinkWrapper
                  route={getAbsoluteRoute()}
                  sidenavOpen={sidenavOpen}
                  key={index}>
                  {group.title
                    ? displayLinkTitles
                      ? <h3>{group.title}</h3>
                      : <h3 style={{ textAlign: "center" }}>-</h3>
                    : null
                  }

                  {/* Fix: OverlayTrigger not working */}
                  <div>
                    {group.links.map((link, index) =>
                      checkPermission(link, user.userTypeId)
                        ? (<OverlayTrigger key={index} placement="right" overlay={!sidenavOpen ? <Tooltip>{link.title}</Tooltip> : <></>}>
                          <div>
                            {link?.route ? (
                              <Link href={link.route} passHref>
                                <SidenavLink>
                                  {link.icon ? link.icon : <i className="bi bi-exclamation-triangle-fill" style={{ color: "var(--danger)" }} />}
                                  {displayLinkTitles && <span>{link.title}</span>}
                                </SidenavLink>
                              </Link>
                            ) : (
                              <SidenavButton onClick={link.onClick}>
                                {link.icon ? link.icon : <i className="bi bi-exclamation-triangle-fill" style={{ color: "var(--danger)" }} />}
                                {displayLinkTitles && <span>{link.title}</span>}
                              </SidenavButton>
                            )}
                          </div>
                        </OverlayTrigger>)
                        : null
                    )}
                  </div>
                </LinkWrapper>
              )
          )}
      </div>
    </Wrapper >
  );
}
