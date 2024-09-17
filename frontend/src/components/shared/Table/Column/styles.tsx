import styled from 'styled-components';

export const ColumnStyled = styled.div<{ hideOnMobile?: boolean, color?: string }>`
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
    height: 24px;
    margin: 10px 0;
    color: var(--white-5);
  }

  @media (max-width: 768px) {
    ${({ hideOnMobile }) => hideOnMobile && "display: none;"}
  }
`;

export const Sortable = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  font-weight: inherit;

  i {
    position: relative;
    margin-right: 5px;

    &:not(.bi-chevron-expand) {
      color: var(--primary-color);
      font-weight: bold;
    }
    
    span {
      font-style: normal;
      position: absolute;
      top: -0.25rem;
      right: -0.25rem;
      
      font-size: 0.625rem;
    }
  }

  &:focus {
    outline: none;
  }
  &:hover {
    color: var(--primary-color-2);
  }
`;