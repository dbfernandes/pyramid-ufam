import styled from "styled-components";
import { Button, ButtonAlt } from "components/shared/Button";

export const HeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;

	& > h3 {
		width: fit-content;
	}
`;

export const AddUserButton = styled(Button)`
	width: fit-content;
	display: flex;
	align-items: center;

	& > i {
		margin-right: 10px;
	}
`;

export const AddUserLink = styled(AddUserButton)``;

export const ListStyled = styled.div`
	display: block;
	margin-top: 15px;
`;

export const Disclaimer = styled.p`
  color: var(--muted);
  margin: 15px 0 0;
`;

export const Filter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;

  margin-top: 15px;
`;