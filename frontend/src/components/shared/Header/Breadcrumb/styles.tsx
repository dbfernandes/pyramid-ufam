import styled from "styled-components";

export const Wrapper = styled.div`
	display: flex;
	align-items: flex-start;

	font-size: 1.125rem;
	line-height: 1.5rem;

  & > div {
    display: flex;

    span {
      color: var(--white-4);
      padding: 0 10px;
    }

    p {
      margin: 0;
    }

    i {
      font-size: 1.25rem;
    }

    @media (max-width: 992px) {
      font-size: 0.9rem;
    }
  }
`;