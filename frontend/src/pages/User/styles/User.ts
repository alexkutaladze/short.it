import styled from "styled-components/macro";

export const InputLabel = styled.p`
	font-weight: 600;
	font-size: 24px;
	color: ${props => props.theme.alt};
	margin-bottom: 13px;
	padding-left: 12.5px;
`;

export const Input = styled.input`
	background: ${props => props.theme.sidebar};
	border: none;
	border-radius: 25px;
	color: ${props => props.theme.icon};
	width: 500px;
	font-size: 24px;
	font-weight: 600;
	height: 80px;
	padding: 0px 12.5px;
	display: flex;
	align-items: center;

	&:focus {
		outline: none;
	}
`;

export const InputContainer = styled.div``;

export const AuthButton = styled.button`
	background: ${props => props.theme.sidebar};
	color: ${props => props.theme.alt};
	width: 150px;
	height: 50px;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 25px;
	margin-top: 40px;
	font-size: 18px;
	color: ${props => props.theme.icon};
	cursor: pointer;
`;

export const Container = styled.div`
	height: inherit;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const AuthText = styled.p`
	color: ${props => props.theme.alt};
	font-weight: 500;
	padding-left: 12.5px;
	padding-top: 20px;
`;

export const AuthAltText = styled.span`
	color: ${props => props.theme.sidebar};
	text-decoration: underline;
	&:hover {
		cursor: pointer;
	}
`;

export const UserInfoContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-left: 80px;
	padding-top: 20px;
`;

export const UserTextContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	& > p {
		color: ${props => props.theme.sidebar};
		font-size: 36px;
		font-weight: 700;
		padding-left: 100px;
	}
`;

export const UserAnalyticsContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
`;

export const UserAnalytics = styled.div`
	flex: 1;
	padding: 0 20px;
`;
