import styled from "styled-components";
import AddResourceButton from "../AddResourceButton";

export const HeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	flex-wrap: wrap;

	& > h3 {
		width: fit-content;
	}
`;

export const AddUserLink = styled(AddResourceButton)`
  padding: 8px 26px;
`;

export const ListStyled = styled.div`
	display: block;
	margin-top: 15px;
`;

export const Disclaimer = styled.p`
  color: var(--muted);
  margin: 15px 0 0;
`;
