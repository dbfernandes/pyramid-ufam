import styled from "styled-components";

export const CustomForm = styled.form`
  max-width: 50%;
`;

export const FormSection = styled.div`
  margin-top: 30px;
`;

export const ProfilePicture = styled.div`
  position: relative;
  margin-bottom: 20px;

  img {
    min-width: 150px;
    min-height: 150px;
    width: 150px;
    height: 150px;
    object-fit: cover;

    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }
  
  .editImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 150px;

    label {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.15);
      outline: none;
      border: none;

      color: var(--white-1);
      font-size: 2rem;
      text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
      cursor: pointer;

      transition: 0.3s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
`;