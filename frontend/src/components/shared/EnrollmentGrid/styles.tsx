import styled from "styled-components";

export const CourseGridComponent = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	min-width: 200px;
`;

export const AddCourseButton = styled.button`
	min-width: 230px;
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
		
	@media (max-width: 768px) {	
		width: 100%;
	}
`;