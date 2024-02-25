import styled from "styled-components";
import { FormCheck } from "react-bootstrap";

export const Wrapper = styled.div`
  position: relative;
  overflow: visible;

  margin-bottom: 20px;

  label {
    margin-bottom: 10px;
    color: var(--muted);
  }
`;

export const Group = styled.div`
  margin: 0 -25px;
  overflow-x: auto;
  scroll-behavior: smooth;

  -ms-overflow-style: none;
	scrollbar-width: none;
  &::-webkit-scrollbar {
		display: none;
	}

  & > div {
    display: flex;
    width: fit-content;
    padding: 0 25px;
  }
`;

export const Option = styled.div`
  width: fit-content;
  position: relative;

  label {
    inline-size: min-content;
    white-space: nowrap;

    margin-bottom: 0 !important;
    margin-right: 10px;
    padding: 10px 15px;

    color: var(--muted);
    border: 1px solid var(--muted);
    border-radius: 25px;

    transition: 0.3s;
  }

  .btn-check:checked + label {
    color: var(--text-default);
    border-color: var(--text-default);
  }

  &:last-child label {
    margin-right: 0;
  }
`;