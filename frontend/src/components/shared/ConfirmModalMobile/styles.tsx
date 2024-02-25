import styled from "styled-components";
import Sheet from "react-modal-sheet";

export const CustomSheet = styled(Sheet)`
  .react-modal-sheet-backdrop {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }
  .react-modal-sheet-container {
    height: fit-content !important;

    background-color: var(--background) !important;
  }
  .react-modal-sheet-header {
    /* custom styles */
  }
  .react-modal-sheet-drag-indicator {
    background-color: var(--muted) !important;
  }
  .react-modal-sheet-content {
    overflow-x: hidden !important;
    padding: 15px !important;
    padding-top: 0 !important;
  }

  p {
    margin-top: 15px;
    color: var(--muted);
  }
`;

export const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;

  margin: 30px 0 10px;

  & > button {
    padding: 6px 12px;
  }
`;