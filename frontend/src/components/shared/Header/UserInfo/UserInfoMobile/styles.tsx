import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 10px;

  background-color: var(--white-1);
  border-radius: 5px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
`;

export const UserPic = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 10px;
    object-fit: cover;
    object-position: center;
    flex-shrink: 0;

    box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.05);
  }
`;

export const UserName = styled.p`
  display: block;
  margin: 0;
  white-space: nowrap; 
  overflow: hidden;

  text-align: center;
  text-overflow: ellipsis;
  margin-bottom: 5px;
`;

export const UserRoleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserRole = styled.span`
	padding: 5px;

	font-weight: 600;
	font-size: 0.75rem;

	color: var(--primary-color);
	background: var(--primary-color-background);
	border-radius: 5px;
`;

export const UserGroup = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
  margin-left: 5px;

  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;

	font-size: 0.75rem;
`;