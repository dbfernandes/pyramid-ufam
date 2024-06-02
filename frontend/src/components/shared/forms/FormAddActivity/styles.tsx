import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 55% 45%;

  & > div:last-child {
    padding: 0 25px 15px;
    border-left: 1px solid var(--white-2);

    & > p {
      font-size: 0.875rem;
      color: var(--muted);
      margin-bottom: 10px;
    }

    & > div {
      height: fit-content;
    }
  }
`;