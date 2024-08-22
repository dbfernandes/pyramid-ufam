import styled from "styled-components";

export const PasswordStrengthWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  bottom: 16px;

  z-index: 20;

  & > div {
    z-index: 20;
  }
`;

export const ColoredBar = styled.div<{ color?: string }>`
  ${({ color }) => color ? `background-color: ${color};` : ""}

  font-size: 0;
  position: absolute;
  top: -4px;
  left: 0;
  width: 100%;
  height: 4px;
  border-radius: 0 0 5px 5px;
  content: "";
`;

export const PasswordStrengthDescription = styled.div`
  position: absolute;
  top: 5px;
  left: 0;
  width: 100%;

  display: flex;
  flex-direction: column;
  grid-gap: 5px;

  padding: 15px 15px 5px;
  border-radius: 5px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white-1);
  font-size: 0.9rem;

  transition: 0.3s;
`;

export const PasswordStrengthCheck = styled.p<{ check?: boolean }>`
  font-size: 0.8rem;
  line-height: 0.8rem;
  margin: 0;
  padding: 0;

  i {
    margin-right: 5px;
  }

  ${({ check }) => (check ? `
    color: var(--text-default) !important;
    font-weight: bold;

    & > i {
      color: var(--primary-color) !important;
    }
  ` : "")}
`;

export const PasswordStrengthMainCheck = styled(PasswordStrengthCheck)`
  font-size: 0.9rem;
  line-height: 0.9rem;
  padding-bottom: 10px;

  border-bottom: 1px solid var(--white-4);

  i {
    margin-right: 8px;
  }
`;