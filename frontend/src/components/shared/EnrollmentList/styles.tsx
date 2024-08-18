import styled from "styled-components";
import { Wrapper as EnrollmentCardWrapper } from "../cards/EnrollmentCard/styles";

export const CourseListComponent = styled.div`
	display: block;
  width: 100%;
  margin-top: 25px;

  ${EnrollmentCardWrapper} {
    width: 100%;
    margin-bottom: 15px;
    padding: 10px;
  }
`;


export const CustomForm = styled.form`
  && { 
  max-width: 50%;

  
  @media (max-width: 768px) {
    max-width: 90%;
    margin: 0 auto;
    margin-top: -60px;
  }
}
`;

export const AddCourseButton = styled.button`
  width: 100%;
  height: 40px;
  margin-bottom: 15px;

	position: relative;
	padding: 10px;
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

	display: flex;
	align-items: center;

	font-size: 1.125rem;
	color: var(--primary-color);
	background: none;
	outline: none;
	border: 1px solid transparent;

	transition: 0.3s;

	&:hover {
		color: var(--primary-color-2);
		border-color: var(--primary-color-2);
	}

  span {
    font-size: 1rem;
    line-height: 1.125rem;
    margin-left: 10px;
    color: var(--text-default);
    font-weight: bold;
  }
`;