import styled from "styled-components/macro";

export const Body = styled.div`
	width: 100vw;
	background: ${props => props.theme.body};
	display: flex;
	flex-direction: row;
	overflow-x: hidden;
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
	position: fixed;

	& > svg {
		cursor: pointer;
	}

	& > ${Iconwrapper}:last-of-type {
		position: absolute;
		bottom: 50px;
	}
`;
export const Main = styled.div`
	width: 90%;
	min-height: 100vh;
	margin-left: 10%;
`;
