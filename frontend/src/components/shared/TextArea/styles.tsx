import styled from 'styled-components';

// Colors
const text = {
  default: "var(--text-default)",
  unfocused: "var(--text-default)",
  focused: "var(--primary-color)",
  valid: "var(--primary-color)",
  invalid: "var(--danger)"
};
const background = {
  unfocused: "var(--white-1)",
  focused: "var(--white-2)"
};
const border = {
  default: "var(--white-4)",
  unfocused: "var(--white-4)",
  focused: "var(--white-4)",
  valid: "var(--primary-color)",
  invalid: "var(--danger)"
}

export const AlertLabel = styled.div`
	position: absolute;
	bottom: -20px;
	right: 0px;

	color: ${text.invalid};
	font-size: 0.75rem;
	font-weight: 400;

	transition: 0.2s;

	&:not(:empty) {
		animation: fade-in 0.1s forwards;

		@keyframes fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}
`;

export const FloatingLabel = styled.div`
	position: absolute;
	left: 8px;

	font-weight: 400;
	transition: 0.15s;
`;

export const Input = styled.textarea`
	&:focus-visible {
		outline: none;
	}
  &:-webkit-autofill,
	&:-webkit-autofill:hover,
	&:-webkit-autofill:focus, 
	&:-webkit-autofill:active {
    height: 116px;
		-webkit-box-shadow: 0 0 0px 1000px ${background.unfocused} inset;
		-webkit-text-fill-color: ${text.default};
	}
  &:-webkit-autofill:hover {
    -webkit-box-shadow: 0 0 0px 1000px ${background.focused} inset;
  }

	width: 100%;
	height: 118px;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;

	padding: 0 8px 0;
	border-radius: 5px;
  border-color: transparent !important;
	resize: none;
	border: none;

	color: ${text.default};
	background-color: transparent;

	transition: 0.2s, border-width 0s, border-color 0.3s;
`;

export const InputWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 120px;
	margin-bottom: 16px;
	z-index: 0;
	
	font-size: 1rem;
	border-radius: 5px;
	border: 1px solid ${border.default};

	&::after {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;

		background-color: ${background.unfocused};
		border-radius: 5px;

		transition: 0.3s;
		content: '';
		opacity: 1;
		
	}
	&:hover {
		&::after {
			background-color: ${background.focused};
		}
		${Input} {
			border-color: ${border.focused};
		}
	}

  border-color: ${props =>
    props.verified
      ? props.valid
        ? !props.empty
          ? border.valid
          : props.focused
            ? border.focused
            : border.unfocused
        : border.invalid
      : props.focused
        ? border.focused
        : border.unfocused};

  & > ${Input} + ${FloatingLabel} {
		color: ${props =>
    props.verified
      ? props.valid
        ? !props.empty
          ? text.valid
          : props.focused
            ? text.focused
            : text.unfocused
        : text.invalid
      : props.focused
        ? text.focused
        : text.unfocused};
		font-size: ${props => props.focused ? "0.75rem" : "1rem"};
		top: ${props => props.focused ? "4px" : "12px"};
		z-index: ${props => props.focused ? 3 : 1};

    & + ${AlertLabel} {
      z-index: ${props => props.focused ? 3 : 1};
    }
	}

  & > ${Input} {
    border-top: ${props => props.focused ? `20px solid transparent` : "none"};
	  border-bottom: ${props => props.focused ? `2px solid transparent` : "none"};
  }
`;

export const CharCount = styled.div`
  position: absolute;
  right: 8px;
  top: 4px;
  z-index: 20;

  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-default);
`;
