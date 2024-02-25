

// Custom
import {
  SidenavButtonStyled
} from "./styles";

// Interface
interface SidenavButtonProps {
  onClick: Function,
  disabled?: boolean,
  children?: React.ReactNode
}

export default function SidenavButton({
  onClick,
  disabled = false,
  children = <></>
}: SidenavButtonProps) {
  return (
    <SidenavButtonStyled onClick={onClick} disabled={disabled}>
      {children}
    </SidenavButtonStyled>
  )
}