import styled from 'styled-components';

export const SpinnerIcon = styled.div`
	&,
	&:after {
		border-radius: 50%;
		width: ${props => props.sizeNumber + props.sizeUnit};
		height: ${props => props.sizeNumber + props.sizeUnit};
	}
	& {
		position: relative;
		text-indent: -9999em;
		border: ${props => parseFloat(props.sizeNumber) / 6 + props.sizeUnit} solid ${props => props.background};
		border-left: ${props => parseFloat(props.sizeNumber) / 6 + props.sizeUnit} solid ${props => props.color};
		-webkit-transform: translateZ(0);
		-ms-transform: translateZ(0);
		transform: translateZ(0);
		-webkit-animation: load8 1.1s infinite linear;
		animation: load8 1.1s infinite linear;
	}
	@-webkit-keyframes load8 {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	@keyframes load8 {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
			}
	}
`;
