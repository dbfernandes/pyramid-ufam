import styled from "styled-components";
import Modal from 'react-bootstrap/Modal';

export const CustomModal = styled(Modal)`
  .modal-header {
    border-radius: 3px;
    background-color: var(--white-1);
    border-bottom: var(--white-1);

    .btn-close {
      align-self: flex-start;
    }
  }
  	.modal-footer {
    	border-top: var(--white-1);
	}
	.modal-content {
		border-radius: 3px;
		border: none;
    	border-top: var(--white-1);
		box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
		background-color: var(--white-1);
	}
`;

export const ButtonGroup = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;

	button {
		padding: 8px 12px !important;
		width: 30%;
		margin-left: 10px;
	}
`;