import styled from "styled-components";

export const Wrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
  align-items: center;
	margin-top: 30px;

  @media (max-width: 992px) {
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }
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

export const ItensCountLabel = styled.p`
  font-size: 0.875rem;
  color: var(--muted);
  margin: 0;
  margin-right: 10px;
`;