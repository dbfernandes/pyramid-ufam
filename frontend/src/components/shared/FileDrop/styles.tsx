import styled from "styled-components";

export const Wrapper = styled.div<{ dragging: boolean, displayAlert: boolean }>`
	position: relative;
	width: 100%;
	background-color: var(--white-2);

	padding: 8px;
	border-radius: 5px;

	transition: 0.3s;

	&:hover {
		background-color: var(--white-3);
		cursor: pointer;
	}

	& > div {
		width: 100%;
		height: 250px;

		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 5px;
		border: 1px dashed var(--muted);

		.file-upload-div {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			i {
				transition: 0.15s;
				font-size: 6rem;
			}

			p {
				margin: 0;
				text-align: center;
			}
		}
	}

	${({ dragging }) => dragging && `
		background: var(--primary-color-2-background);
		& > div {
			border-color: var(--primary-color-2);

			.file-upload-div i, .file-upload-div p {
				color: var(--primary-color-2) !important;
			}
		}
	`}

	${({ displayAlert }) => displayAlert && `
		& > div {
			border-color: var(--danger);
		}
	`}

	input[type="file"] {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		cursor: pointer;
	}
`;

export const Alert = styled.div`
	position: absolute;
	right: 20px;
	top: 20px;
	color: var(--danger);
`;