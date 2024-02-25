

// Custom
import {
  GridStyled
} from "./styles";

export default function Grid(props) {
  return (
    <GridStyled {...props}>
      {props.children}
    </GridStyled>
  );
}