import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .spinner {
    margin-bottom: 35px;
  }

  i {
    margin-bottom: 35px;
    font-size: 5rem;

    &.bi-check-circle-fill {
			color: var(--primary-color);
    }
    &.bi-x-circle-fill {
			color: var(--danger);
    }
  }

  animation: slide 0.5s forwards;
	@keyframes slide {
		from {
			opacity: 0;
			margin-top: 50px;
		}
		to {
			opacity: 1;
			margin-top: 0;
		}
	}
`;

export const TextAlertStyled = styled.p`
  margin: 0;
  
  text-align: center;
`;