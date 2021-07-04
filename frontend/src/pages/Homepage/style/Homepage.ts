import styled from "styled-components/macro";
import { Iconwrapper } from "../../../Components/Body/styles/Body";

export const Header = styled.div`
	font-family: "Jura", sans-serif;
	font-weight: 700;
	font-size: 144px;
	margin-top: 150px;
	color: ${props => props.theme.sidebar};
`;

export const LinkInputContainer = styled.div`
	margin-top: 150px;
	position: relative;
	height: 80px;
	width: 550px;
	border-radius: 50px;
	border: 1px solid ${props => props.theme.sidebar};
	padding: 0 25px;
	display: flex;
	flex-direction: row;
	justify-content: center;

	& > ${Iconwrapper} {
		flex: 1;
		position: relative;
		margin: 0;
		color: ${props => props.theme.sidebar};
		align-items: center;

		&:hover {
			cursor: default;
		}
	}
`;

export const LinkInput = styled.input`
	flex: 5;
	border: none;
	background: none;
	font-weight: 600px;
	font-size: 24px;
	color: ${props => props.theme.sidebar};

	&:focus {
		outline: none;
	}

	::placeholder {
		color: ${props => props.theme.sidebar};
	}
`;

export const SubmitButton = styled.button`
	width: 275px;
	margin-top: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50px;
	padding: 0 25px;
	background: ${props => props.theme.sidebar};
	border: none;
	height: 60px;
	font-size: 24px;
	font-weight: 600;
	color: ${props => props.theme.icon};

	&:hover {
		cursor: pointer;
	}
`;

export const GeneratedLink = styled.a`
	font-size: 24px;
	font-weight: 600;
	display: flex;
	align-items: center;
	color: ${props => props.theme.sidebar}
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: inherit;
`;
