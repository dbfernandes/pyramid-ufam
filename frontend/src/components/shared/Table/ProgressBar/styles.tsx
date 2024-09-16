import { ProgressBar } from 'react-bootstrap';
import styled from 'styled-components';

// Custom progress bar
export const CustomProgressBarWrapper = styled.div`
  width: 100%;
  position: relative;

  & > span {
    width: 100%;
    position: absolute;
    top: 0%;
    left: 50%;

    text-align: center;
    font-weight: bold;
    color: var(--white-1);
    font-size: 0.75rem;
    transform: translateX(-50%);
  }
`;
export const CustomProgressBar = styled(ProgressBar) <{ background?: string }>`
  height: 15px;
  border-radius: 8px;
  ${({ background }) => `background-color: ${background};`}
`;