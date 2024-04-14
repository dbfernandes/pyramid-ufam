
import { H3 } from "components/shared/Titles";

// Styled
import {
  FormWrapper
} from "./styles";

// Interface
interface IContent {
  children?: React.ReactNode;
  fullscreen?: boolean;
};

export default function Content({ children, fullscreen = false }: IContent): JSX.Element {
  return (
    <FormWrapper fullscreen={fullscreen}>
      <form>
        {children}
      </form>
    </FormWrapper>
  );
}