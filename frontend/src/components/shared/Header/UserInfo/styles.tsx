import styled from "styled-components";

export const Wrapper = styled.div`
	
`;

export const Logoff = styled.button`
	width: auto;
	height: 100%;
	padding: 5px;
	margin-left: 5px;

	display: flex;
	align-items: center;

	color: var(--text-default);
	background-color: transparent;
	border-radius: 5px;
	outline: none;
	border: none;

	& > i {
    font-size: 1.25rem;
	}

	transition: 0.3s;
	&:hover {
		color: var(--primary-color-2);
		background: var(--primary-color-2-background);
	}
`;

export const UserName = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;

	margin-bottom: 5px;

	p {
		margin: 0;
	}

  @media (max-width: 992px) {
    margin-bottom: 0;
  }
`;

export const UserPic = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
    object-position: center;
    flex-shrink: 0;

    box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.05);
  }
`;

export const UserRole = styled.span`
	padding: 5px;
	margin-left: 5px;

	font-weight: 600;
	font-size: 0.85rem;

	color: var(--primary-color);
	background: var(--primary-color-background);
	border-radius: 5px;
`;

export const UserGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;

	margin: 0;
	font-size: 0.75rem;
	text-align: right;
`;

export const ChangeCourse = styled(Logoff)`
  & > i {
    font-size: 0.825rem;
  }
`;