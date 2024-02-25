
import { H3 } from "components/shared/Titles";

// Styled
import {
  FormWrapper
} from "./styles";

// Interface
interface IForm {
  title?: string;
  fullscreen?: boolean;
  children?: React.ReactNode;
};

export default function FormPage({ title, fullscreen = false, children }: IForm): JSX.Element {
  return (
    <FormWrapper fullscreen={fullscreen}>
      <div>
        {title &&
          <H3 style={{ marginBottom: 35 }}>{title}</H3>
        }

        <form>
          {children}
        </form>
      </div>
    </FormWrapper>
  );
}