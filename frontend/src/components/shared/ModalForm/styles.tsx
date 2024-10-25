import styled from "styled-components";
import Modal from 'react-bootstrap/Modal';

export const CustomModal = styled(Modal)`
  .modal-header {
    padding: 30px 30px 15px;
    border-radius: 3px;
    background-color: var(--white-1);
    border-bottom: var(--white-1);

    .btn-close {
      align-self: flex-start;
    }
  }
	.modal-content {
		border: none;
    background-color: var(--white-1);
		box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
	}
  .modal-body {
    padding: 0;
    background-color: var(--white-1);
    border-radius: 3px;
  }
`;