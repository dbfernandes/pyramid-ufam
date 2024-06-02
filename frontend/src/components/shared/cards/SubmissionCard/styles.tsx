import styled from "styled-components";
import { FormCheck } from "react-bootstrap";
import { Button, ButtonAlt } from "components/shared/Button";

export const ItemWrapper = styled.div`
  margin-bottom: 15px;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
  border-radius: 5px;

  transition: 0.3s;

  &:hover {
		border-color: rgba(0, 0, 0, 0.2);
	}
`;

export const CollapseDetailsStyled = styled.div<{ admin: boolean }>`
	background-color: var(--white-1);
	padding: 10px 20px 15px;
	border-radius: 0 0 5px 5px;

	& > .grid {
		display: grid;
		grid-template-columns: 3fr 3fr 3fr;
		grid-gap: 30px;
	}
`;

export const Item = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 60px 1fr 1fr 1fr 1fr 1fr 45px;
	column-gap: 15px;
	align-items: center;

	margin-top: 5px;
	padding: 0;

	${props => !props.header && "margin: 0; margin-bottom: -5px;"}
	border-radius: 5px;
	transition: 0.3s;

	cursor: pointer;

	.id, .name {
		transition: 0.3s;
	}
`;

export const Column = styled.div`
	color: ${props => props.color ? props.color : "var(--text-default)"};
	padding: 15px;

	white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;

	i {
		vertical-align: top;
		font-size: 0.875rem;
		margin-right: 10px;
	}
`;

export const CustomFormCheck = styled(FormCheck)`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;

	margin: 0;
	padding: 15px;

	& > input {
		margin: 0 !important;
		padding: 7.5px;
		z-index: 1;
    transition: 0.3s;

    &:checked {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.25rem rgba(34, 201, 159, .25);
    }
	}

	.form-check-label {
		position: absolute;
		width: 100%;
		height: 100%;
	}
`;

export const CheckboxPreventClick = styled.div`
  width: 100%;
  height: 100%;
  content: "";
`;

export const SubmissionStatusStyled = styled.div`
	p {
		margin-bottom: 5px;
	}

	& > div {
		display: grid;
		grid-template-columns: 20px 20px 20px;
		grid-gap: 5px;
	}
`;

const coloredBarColors = {
  "g": "var(--primary-color)",
  "r": "var(--danger)",
  "w": "var(--white-5)"
};
export const ColoredBar = styled.div<{ color: string }>`
	width: 20px;
	height: 3px;
	background-color: ${({ color }) => coloredBarColors[color]};
`;

export const Info = styled.div`
	padding: 20px;
	
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
	border-radius: 5px;

	& > h6 {
		font-size: 1.125rem;
		margin-bottom: 15px;
	}
	& > p {
		margin-bottom: 5px;
	}
`;

export const FileInfo = styled(Info)`
	width: 100%;
	overflow: hidden;

	a {
		overflow: hidden;
		word-break: break-all;

		position: relative;
		display: flex;
		align-items: center;
		padding: 10px;

		color: var(--text-default);
		border-radius: 5px;
		border: 1px solid var(--white-5);

		transition: 0.3s;

		i {
			font-size: 2rem;
			margin-right: 10px;
		}

		p {
			
			margin-bottom: 0px;
			transition: 0.3s;
		}
		span {
			margin: 0;
			color: var(--muted);
			font-size: 0.875rem;
		}

		& > div i {
			position: absolute;
			bottom: 12px;
			right: 0px;
			color: var(--muted);
			font-size: 0.875rem;
		}

		&:hover {
			border-color: var(--primary-color-2);

			& > div i {
				color: var(--primary-color-2);
			}
		}

		&:not(:last-child) {
			margin-bottom: 10px;
		}
	}
`;

export const ButtonGroup = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: flex-start;

	margin-top: 15px;
`;

export const AcceptButton = styled(Button)`
	width: fit-content;
  padding: 8px 26px;
	margin-left: 10px;
`;

export const EditButton = styled(ButtonAlt)`
	width: fit-content;
  padding: 8px 26px;
	margin-left: 10px;
`;

export const InfoButton = styled(ButtonAlt)`
  width: fit-content;
  padding: 8px 26px;
  margin-left: 10px;

  color: var(--success);

	&:hover {
    color: var(--success-hover);
		border-color: var(--success-hover);
	}
`;

export const DangerButtonAlt = styled(ButtonAlt)`
	width: fit-content;
  padding: 8px 26px;
  margin-left: 10px;

  color: var(--danger);

	&:hover {
    color: var(--danger-hover);
		border-color: var(--danger-hover);
	}
`;