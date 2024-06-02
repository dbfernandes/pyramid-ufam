import styled, { css } from "styled-components";

const Title = css<{ center: boolean }>`
	color: var(--text-default);
	font-weight: bold;

	${({ center }) => center &&
		"display: flex;" +
		"align-items: center;" +
		"flex-direction: column;"
	}

	i {
		color: var(--black-3);
	}
	
	&:after {
		width: 50px;
		height: 2px;
		display: block;

		margin-top: 10px;

		background-image: linear-gradient(to right, var(--primary-color), var(--primary-color-2));
		content: "";
	};
`;

const H1 = styled.h1`
	${Title};
`;

const H2 = styled.h2`
	${Title};
`;

const H3 = styled.h3`
	${Title};
`;

const H4 = styled.h4`
	${Title};
`;

const H5 = styled.h5`
	${Title};
`;

const H6 = styled.h6`
	${Title};
`;

export { H1, H2, H3, H4, H5, H6 };