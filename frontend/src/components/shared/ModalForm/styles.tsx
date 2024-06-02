import styled from "styled-components";
import Modal from 'react-bootstrap/Modal';

export const CustomModal = styled(Modal)`
  .modal-header {
    padding: 30px 30px 15px;
    border: none;

    .btn-close {
      align-self: flex-start;
    }
  }
	.modal-content {
		border-radius: 5px;
		border: none;
		box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
	}
  .modal-body {
    padding: 0;
  }
`;