

// Custom
import {
  ListStyled
} from "./styles";

export default function List(props) {
  return (
    <ListStyled {...props}>
      {props.children}
    </ListStyled>
  );
}