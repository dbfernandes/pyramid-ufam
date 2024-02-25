// Shared
import Spinner from "components/shared/Spinner";

// Custom
import {
  Wrapper,
  TextAlertStyled
} from "./styles";

// Interface
interface ITextAlertProps {
  children: React.ReactNode;
  displayIcon?: boolean;
  type?: "success" | "error" | "loading";
}

export default function TextAlert({
  children,
  displayIcon = false,
  type = "success"
}: ITextAlertProps) {
  return (
    displayIcon
      ? <Wrapper>
        {type == "loading" && <Spinner size="4rem" color="white" />}
        {(type == "success" || type == "error") && <i className={`bi bi-${type == "success" ? "check-circle-fill" : "x-circle-fill"}`} />}
        <TextAlertStyled>{children}</TextAlertStyled>
      </Wrapper>
      : <TextAlertStyled>{children}</TextAlertStyled>
  )
}