import styled from "styled-components";

export const Wrapper = styled.div`
	width: 100%;
	background-color: var(--white-1);
	padding: 25px;
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

	& > div {
		display: flex;
		flex-direction: column;
		align-items: baseline;

    p.title {
      color: var(--muted);
      margin-bottom: 15px;
    }

		p {
			margin: 0;
		}
	}
`;

export const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	grid-gap: 15px;
	width: 100%;

	@media (max-width: 768px) {
		margin-bottom: 10px;
	}
`