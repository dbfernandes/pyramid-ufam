import styled from 'styled-components';

// CopyToClipboardSpan button
export const CopyToClipboardSpan = styled.span`
  cursor: pointer;
  transition: 0.3s;
  
  &:hover {
    color: var(--primary-color-2);
  }
  
  & > i {
    margin-left: 5px;
    font-size: 0.75rem;
    vertical-align: text-top;
  }
`;