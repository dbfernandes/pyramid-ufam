import Link from "next/link";

// Shared
import Spinner from "components/shared/Spinner";

// Custom
import {
  Wrapper,
  TextAlertStyled,
  CallToAction
} from "./styles";

// Interface
interface ITextAlertProps {
  displayIcon?: boolean;
  type?: "success" | "error" | "loading";
  link?: string;
  children: React.ReactNode;
}

export default function TextAlert({
  displayIcon = false,
  type = "success",
  link,
  children,
}: ITextAlertProps) {
  const icons = {
    success: {
      icon: "check-circle-fill",
      color: "var(--primary-color)"
    },
    error: {
      icon: "x-circle-fill",
      color: "var(--danger)"
    },
    warning: {
      icon: "exclamation-circle-fill",
      color: "var(--warning)"
    },
  }
  return (
    displayIcon
      ? <Wrapper accent={icons[type].color}>
        {type === "loading"
          ? <Spinner size="4rem" color="white" />
          : <i className={`bi bi-${icons[type].icon}`} />
        }
        <TextAlertStyled>{children}</TextAlertStyled>
        {type !== "loading" && link &&
          <Link href={link}>
            <a>
              <CallToAction>
                Voltar para a página inicial
              </CallToAction>
            </a>
          </Link>
        }
      </Wrapper>
      : <TextAlertStyled>{children}</TextAlertStyled>
  )
}