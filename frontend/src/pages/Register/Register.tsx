import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Body from "../../Components/Body/Body";
import {
	AuthAltText,
	AuthButton,
	AuthText,
	Container,
	ErrorText,
	Input,
	InputContainer,
	InputLabel,
} from "../User/styles/User";

const emailRegex = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g;
interface ErrorProps {
	username: boolean;
	password: boolean;
	fullname: boolean;
	email: boolean;
}

const Register = () => {
	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [validationErrors, setValidationErrors] = useState<ErrorProps>({
		username: false,
		password: false,
		fullname: false,
		email: false,
	});
	const [registerAttempt, setRegisterAttempt] = useState(false);

	useEffect(() => {
		if (!registerAttempt) return;
		setValidationErrors({
			email: !emailRegex.test(email),
			username: !(username.length > 0),
			password: !(password.length > 0),
			fullname: !(fullname.length > 0),
		});
	}, [username, password, email, fullname, registerAttempt]);

	const register = async (
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		if (!emailRegex.test(email) || !username || !password || !fullname) {
			if (!registerAttempt) setRegisterAttempt(true);
			setValidationErrors({
				email: !emailRegex.test(email),
				password: !password,
				username: !username,
				fullname: !fullname,
			});
			return;
		}
		const body = {
			name: fullname,
			username: username,
			email: email,
			password: password,
		};

		await fetch("http://localhost:4000/register", {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-type": "application/json",
			},
		})
			.then(values => values.json())
			.then(data => {
				if (!data.ok) {
					alert("Username/Email already taken");
					return;
				}
				window.location.href = "http://localhost:3000/user";
				setUsername("");
				setPassword("");
				setEmail("");
				setFullname("");
			})
			.catch(e => alert(e));
	};

	return (
		<Body>
			<Container>
				<form onSubmit={e => register(e)}>
					<InputContainer>
						<InputContainer>
							<InputLabel>Full Name</InputLabel>
							<Input required value={fullname} onChange={e => setFullname(e.target.value)} />
							{validationErrors.fullname && <ErrorText>Please enter your full name</ErrorText>}
						</InputContainer>
						<InputContainer>
							<InputLabel>E-mail</InputLabel>
							<Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
							{validationErrors.email && <ErrorText>Please provide your e-mail</ErrorText>}
						</InputContainer>
						<InputContainer>
							<InputLabel>Username</InputLabel>
							<Input required value={username} onChange={e => setUsername(e.target.value)} />
							{validationErrors.username && <ErrorText>Please enter a username</ErrorText>}
						</InputContainer>
						<InputContainer>
							<InputLabel>Password</InputLabel>
							<Input
								required
								type="password"
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							{validationErrors.password && <ErrorText>Please enter a password</ErrorText>}
						</InputContainer>
						<AuthButton type="submit" onClick={e => register(e)}>
							Register
						</AuthButton>
						<AuthText>
							Already have an account?{" "}
							<Link to="/user">
								<AuthAltText>Login</AuthAltText>
							</Link>{" "}
							here
						</AuthText>
					</InputContainer>
				</form>
			</Container>
		</Body>
	);
};

export default Register;
