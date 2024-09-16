import styled from 'styled-components';

export const Column = styled.div<{ hideOnMobile?: boolean, color?: string }>`
  color: ${({ color }) => color ? color : "var(--text-default)"};
  padding: 0;
  
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;

  .text-with-ribbon {
    display: flex;
    
    span {
      white-space: nowrap; 
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  i {
		vertical-align: top;
		font-size: 0.875rem;
		margin-right: 10px;
	}

  & > .placeholder {
    color: var(--white-5);
  }

  @media (max-width: 768px) {
    ${({ hideOnMobile }) => hideOnMobile && "display: none;"}
  }
`;