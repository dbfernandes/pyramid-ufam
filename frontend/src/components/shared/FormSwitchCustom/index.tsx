import styled from "styled-components";
import { FormCheck } from "react-bootstrap";

const FormSwitchCustom = styled(FormCheck)`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;
  padding: 0;

  color: var(--muted);

  .form-check-input {
    width: 2.5rem;
    height: 1.25rem;

    margin: 0;

    background-color: transparent;
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='rgba%28255, 255, 255, 1%29'/></svg>") !important;
    border-color: var(--muted);

    &:checked {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    &:focus {
      border-color: var(--primary-color);
      box-shadow: none;
    }
  }
`;

export default FormSwitchCustom;