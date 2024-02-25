import styled from "styled-components";
import { FormCheck } from "react-bootstrap";
import Button, { ButtonAlt } from "components/shared/Button";

export const Item = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 60px 1fr 1fr 1fr 1fr 1fr 30px;
	column-gap: 15px;
	align-items: center;

	margin-top: 5px;
	padding: 0;
	padding-right: 15px;
	border: 1px solid transparent;

	${props => !props.header ? "background-color: var(--white-2);" : "margin: 0; margin-bottom: -5px;"}
	border-radius: 5px;
	transition: 0.3s;

	cursor: pointer;

	.id, .name {
		transition: 0.3s;
	}

	${props => !props.header && `
		&:hover {
			border-color: rgba(0, 0, 0, 0.2);
			background-color: var(--white-2);
		}
	`}

	${props => props.collapsed && `
		border-radius: 5px 5px 0 0;
		border-color: rgba(0, 0, 0, 0.2);
		border-bottom-width: 0;

		&:hover {
			background-color: var(--white-3);
		}
	`}
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

export const CollapseDetailsStyled = styled.div<{ admin: boolean }>`
	background-color: var(--white-2);
	padding: 10px 20px 15px;
	border-radius: 0 0 5px 5px;

	border: 1px solid rgba(0, 0, 0, 0.2);
	border-top-width: 0;

	& > .grid {
		display: grid;
		grid-template-columns: ${({ admin }) => admin ? "2fr 2fr 1fr" : "2fr 1fr 2fr"};
		grid-gap: 30px;
	}
`;

export const Info = styled.div`
	padding: 20px;
	background-color: var(--white-3);
	border: 1px solid var(--white-5);
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
	display: flex;
	align-items: center;

	margin-left: 10px;

	& > i {
		margin-right: 10px;
	}
`;

export const DangerButton = styled(Button)`
	width: fit-content;
	display: flex;
	align-items: center;

  background-image: linear-gradient(to right, var(--danger) 0%, #da2d58 51%, var(--danger-hover) 100%);

	& > i {
		margin-right: 10px;
	}
`;

export const DangerButtonAlt = styled(ButtonAlt)`
	width: fit-content;
	display: flex;
	align-items: center;

	color: var(--danger);
	border-color: var(--danger);

	& > i {
		margin-right: 10px;
	}

	&:hover {
		color: var(--danger-hover);
		background: color-mix(in srgb, var(--danger-hover) 10%, transparent);
	}
`;