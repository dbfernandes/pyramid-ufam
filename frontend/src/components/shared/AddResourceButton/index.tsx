import styled from 'styled-components';
import { Button } from '../Button';

const AddResourceButton = styled(Button)`
	width: fit-content;
	display: flex;
	align-items: center;

	& > i {
		margin-right: 10px;
	}

  @media (max-width: 575px) {
    width: 100%;
    margin-top: 15px;
  }
`;

export default AddResourceButton;