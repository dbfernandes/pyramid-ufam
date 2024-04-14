import styled from "styled-components";

export const Wrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	margin-top: 30px;
`;

export const PaginatorWrapper = styled.div`
	display: flex;
`;

export const PageItem = styled.button<{ marked: boolean }>`
	width: 35px;
	height: 35px;
	display: flex;
	justify-content: center;
	align-items: center;

	margin-left: 5px;
	border-radius: 50%;
	background: none;
	border: none;
	outline: none;
	transition: 0.3s;

	color: var(--text-default);

	&:hover {
		color: var(--primary-color-2);
		background: var(--primary-color-2-background);
	}

	${({ marked }) => marked && `
		background-color: var(--primary-color);
		color: var(--white-1);

		&:hover {
			color: var(--white-1);
			background: var(--primary-color-2);
		}
	`}
`;

export const PageArrowButton = styled(PageItem)`
	background: none;
	color: var(--primary-color);

	&:disabled {
		color: var(--muted);
	}
`;