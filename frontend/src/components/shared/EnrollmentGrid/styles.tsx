import styled from "styled-components";

export const CourseGridComponent = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-gap: 25px;
`;

export const AddCourseButton = styled.button`
	position: relative;
	padding: 20px;
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

	display: flex;
	justify-content: center;
	align-items: center;

	font-size: 2.5rem;
	color: var(--primary-color);
	background: none;
	outline: none;
	border: 1px solid transparent;

	transition: 0.3s;

	&:hover {
		color: var(--primary-color-2);
		border-color: var(--primary-color-2);
	}
`;