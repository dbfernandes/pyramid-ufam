import styled from "styled-components";

export const Logo = styled.img`
	align-self: center;
	height: 60px;
	width: auto;
	object-fit: contain;
	margin: 0 0 35px;

  @media (max-width: 992px) {
    height: 40px;
  }
`;

export const InstitutionalLogos = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	margin: 35px 0 0;

	img {
		height: 60px;
		width: auto;
		object-fit: contain;
		margin: 0 30px;
	}
`;

export const Info = styled.p`
	font-weight: 400;
	color: var(--text-default) !important;
	margin-bottom: 35px !important;
	text-align: center;
`;