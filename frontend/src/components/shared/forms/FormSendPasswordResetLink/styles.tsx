import styled from "styled-components";

export const CustomForm = styled.form`
  max-width: 50%;
  
  @media (max-width: 768px) {
    max-width: 90%;
    margin: 0 auto;
  }
`;

export const FormSection = styled.div`
  p {
    margin-bottom: 15px;
    color: var(--muted);
  }
`;
