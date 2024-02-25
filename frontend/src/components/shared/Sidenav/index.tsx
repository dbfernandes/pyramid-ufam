import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout, defaultCourse } from "redux/slicer/user";
import {
  ArrowLeftRight,
  BoxArrowRight,
  FileEarmarkBarGraph,
  FileEarmarkPlus,
  GridFill,
  ListCheck,
  MortarboardFill,
  People,
  Person,
  PersonBadge,
  PersonPlus,
  PersonWorkspace,
  PlusSquare,
  TagFill,

  Lightbulb,
  PersonVideo3,
  Search,
} from "react-bootstrap-icons";

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
          icon: <FileEarmarkBarGraph />,
          title: "Painel",
          route: "/painel",
        },
        {
          icon: <Person />,
          title: "Minha conta",
          route: "/conta",
        },
        {
          icon: <ArrowLeftRight />,
          title: "Trocar de curso",
          onClick: () => dispatch(defaultCourse(null)),
        },
        {
          icon: <BoxArrowRight />,
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
          icon: <FileEarmarkPlus />,
          title: "Nova solicitação",
          route: "/minhas-solicitacoes/nova",
          permissions: [3],
        },
        {
          icon: <ListCheck />,
          title: "Minhas solicitações",
          route: "/minhas-solicitacoes",
          permissions: [3],
        },
        {
          icon: <NestedIcon>
            <ListCheck />
            <MortarboardFill />
          </NestedIcon>,
          title: "Solicitações",
          route: "/solicitacoes",
          permissions: [1, 2],
        },
        {
          icon: <NestedIcon>
            <ListCheck />
            <GridFill />
          </NestedIcon>,
          title: "Solicitações por grupo de atividade",
          route: "/solicitacoes/grupo-atividade",
          permissions: [1, 2]
        },
        {
          icon: <NestedIcon>
            <ListCheck />
            <TagFill />
          </NestedIcon>,
          title: "Solicitações por atividade",
          route: "/solicitacoes/atividade",
          permissions: [1, 2]
        }
      ],
    },
    {
      title: "Usuários",
      links: [
        {
          icon: <PersonPlus />,
          title: "Adicionar usuário",
          route: "/usuarios/novo",
        },
        {
          icon: <People />,
          title: "Alunos",
          route: "/usuarios/alunos",
        },
        {
          icon: <PersonWorkspace />,
          title: "Coordenadores",
          route: "/usuarios/coordenadores",
        },
        {
          icon: <PersonBadge />,
          title: "Secretários",
          route: "/usuarios/secretarios",
        },
      ],
      permissions: [1],
    },
    {
      title: "Cursos",
      links: [
        {
          icon: <MortarboardFill />,
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
          icon: <PersonVideo3 />,
          title: "Ensino",
          route: "/atividades/ensino",
        },
        {
          icon: <Search />,
          title: "Pesquisa",
          route: "/atividades/pesquisa",
        },
        {
          icon: <Lightbulb />,
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
                      checkPermission(link, user.userTypeId) ? (
                        link?.route ? (
                          <OverlayTrigger key={index} placement="bottom" overlay={<Tooltip>{link.title}</Tooltip>}>
                            <Link href={link.route} passHref>
                              <SidenavLink>
                                {link.icon ? link.icon : <i className="bi bi-exclamation-triangle-fill" style={{ color: "var(--danger)" }} />}
                                {displayLinkTitles && <span>{link.title}</span>}
                              </SidenavLink>
                            </Link>
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger key={index} placement="bottom" overlay={<Tooltip>{link.title}</Tooltip>}>
                            <SidenavButton onClick={link.onClick}>
                              {link.icon ? link.icon : <i className="bi bi-exclamation-triangle-fill" style={{ color: "var(--danger)" }} />}
                              {displayLinkTitles && <span>{link.title}</span>}
                            </SidenavButton>
                          </OverlayTrigger>
                        )
                      ) : null
                    )}
                  </div>
                </LinkWrapper>
              )
          )}
      </div>
    </Wrapper >
  );
}
