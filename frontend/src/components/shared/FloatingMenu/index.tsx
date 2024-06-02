import { useState } from "react";

// Custom
import {
  AddButton,
  CollapseButton,
  CollapseCustom,
  MoreOptionsButton,
  Wrapper
} from "./styles";

// Interfaces
interface IFloatingMenuProps {
  onClickAdd: Function;
  displayMore?: boolean;
  children?: React.ReactNode;
}

export default function FloatingMenu({
  onClickAdd,
  displayMore = true
}: IFloatingMenuProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Wrapper>
      <div>
        {displayMore &&
          <MoreOptionsButton
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={collapsed}
            collapsed={collapsed}>
            <i className="bi bi-three-dots-vertical" />
          </MoreOptionsButton>}
        <AddButton onClick={onClickAdd}><i className="bi bi-plus" /></AddButton>
      </div>

      <CollapseCustom in={collapsed} timeout={100}>
        <div>
          <div>
            <CollapseButton color="var(--success)">
              <i className="bi bi-pencil-fill" /> Editar selecionados
            </CollapseButton>

            <CollapseButton color="var(--danger)">
              <i className="bi bi-trash-fill" /> Remover selecionados
            </CollapseButton>
          </div>
        </div>
      </CollapseCustom>
    </Wrapper>
  )
}