import styled from "styled-components";
import { Item } from "components/shared/Table";

export const CustomItem = styled(Item) <{ header?: boolean, student: boolean }>`
  grid-template-columns: 45px 30px ${({ student }) => student ? "2fr 1fr 1fr 1fr 1fr 1fr" : "3fr 3fr 3fr"} 60px 30px 30px;

  @media (max-width: 768px) {
    grid-template-columns: 45px 40px ${({ student }) => student ? "minmax(0, 2fr) 1fr" : "3fr"} 30px 30px;
  }
  @media (max-width: 575px) {
    grid-template-columns: 35px 40px ${({ student }) => student ? "minmax(0, 2fr) 1fr" : "3fr"} 30px 30px;
  }
`;

// Custom column to display user status as either active or inactive
export const UserStatus = styled.span`
  padding: 5px;

  font-weight: 600;
  font-size: 0.85rem;

  color: ${(props) => (props.status === true ? 'var(--primary-color)' : 'var(--danger)')};
  background: ${(props) =>
    props.status === true
      ? 'var(--primary-color-background)'
      : 'color-mix(in srgb, var(--danger) 10%, transparent)'};
  border-radius: 5px;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 4px;
  }
`;

// Custom ribbon to display user courses
export const Ribbon = styled.div<{ left: number }>`
  padding: 5px;
  margin-left: 10px;

  font-weight: 600;
  font-size: 0.85rem;

  color: var(--primary-color);
  background: var(--primary-color-background);
  border-radius: 5px;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 4px;
    margin-left: 8px;
  }
`;