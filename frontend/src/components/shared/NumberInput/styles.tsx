import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;

  label {
    color: var(--muted);
  }
`;

export const ValueWrapper = styled.div`
  display: flex;
  align-items: center;

  p {
    width: 16px;
    margin: 0 10px 0 !important;

    text-align: center;
  }

  button {
    width: 25px;
    height: 25px;

    display: flex;
    justify-content: center;
    align-items: center;
    
    font-size: 0.625rem;
    background-color: var(--primary-color);
    color: var(--text-default);
    outline: none;
    border: none;
    border-radius: 5px;

    transition: 0.3s;

    &:hover {
      background-color: var(--primary-color-2);
    }

    &:disabled {
      background-color: var(--black-3);
    }
  }
`;