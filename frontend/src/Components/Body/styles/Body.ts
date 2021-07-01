import styled from "styled-components/macro";

export const Body = styled.div`
	min-height: 100vh;
	width: 100vw;
	background: ${props => props.theme.body};
	display: flex;
	flex-direction: row;
`;

export const Iconwrapper = styled.div`
	color: ${props => props.theme.icon};
	width: 100%;
	display: flex;
	justify-content: center;
	transition: color ease 0.3s;

	margin-top: 100px;

	&:hover {
		cursor: pointer;
		color: ${props => props.theme.alt};
	}
`;

export const Sidebar = styled.div`
	height: 100vh;
	width: 10%;
	background: ${props => props.theme.sidebar};

	& > svg {
		cursor: pointer;
	}
	position: relative;

	& > ${Iconwrapper}:last-of-type {
		position: absolute;
		bottom: 50px;
	}
`;
export const Main = styled.div`
	width: 90%;
	height: 100vh;
`;
