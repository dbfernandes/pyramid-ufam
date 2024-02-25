

// Custom
import { WrapperStyled } from "./styles";

export default function Wrapper({ maxWidth = 575, ...props }) {
  return (
    <WrapperStyled maxWidth={maxWidth} {...props}>
      <div>
        {props.children}
      </div>
    </WrapperStyled>
  );
}