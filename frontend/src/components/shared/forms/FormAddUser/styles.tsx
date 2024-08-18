import styled from "styled-components";

export const CustomForm = styled.form`
  max-width: 50%;
  
  @media (max-width: 768px) {
    max-width: 90%;
  }
`;

export const FormSection = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-top: 0px;
  }
`;