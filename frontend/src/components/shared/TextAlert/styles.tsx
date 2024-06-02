import styled from "styled-components";
import { ButtonAlt } from "../Button";

export const TextAlertStyled = styled.h2`
  margin: 0;
  
  // color: var(--muted);
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
`;

export const CallToAction = styled(ButtonAlt)`
  padding: 8px 26px;
	margin-top: 25px;
`;

export const Wrapper = styled.div<{ accent: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 25px;

	background-color: var(--white-1);
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

  .spinner {
    margin-bottom: 35px;
  }

  i {
    margin-bottom: 35px;
    font-size: 5rem;
    color: ${(props) => props.accent};
  }

  ${CallToAction} {
    color: ${({ accent }) => accent};

    &:hover {
      border-color: ${({ accent }) => accent};
    }
  }

  animation: slide 0.5s forwards;
	@keyframes slide {
		from {
			opacity: 0;
			margin-top: 50px;
		}
		to {
			opacity: 1;
			margin-top: 0;
		}
	}
`;