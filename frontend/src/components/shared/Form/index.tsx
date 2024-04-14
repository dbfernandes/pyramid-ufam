
import { H3 } from "components/shared/Titles";

// Styled
import {
  FormWrapper
} from "./styles";

// Interface
interface IForm {
  title?: string;
  children?: React.ReactNode;
  fullscreen?: boolean;
};

export default function Form({ title, children, fullscreen = false }: IForm): JSX.Element {
  return (
    <FormWrapper fullscreen={fullscreen}>
      {title &&
        <H3 style={{ marginBottom: 35 }}>{title}</H3>
      }

      <form>
        {children}
      </form>
    </FormWrapper>
  );
}