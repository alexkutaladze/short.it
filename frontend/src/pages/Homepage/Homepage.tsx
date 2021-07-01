import React, { useContext, useEffect, useState } from "react";
import { BsLink } from "react-icons/bs";
import { UserContext } from "../../Context/UserContext";
import { IGeneratedURL } from "../../types/IGeneratedURL";
import {
	Container,
	GeneratedLink,
	Header,
	LinkInput,
	LinkInputContainer,
	SubmitButton,
} from "./style/Homepage";
import { Iconwrapper } from "../../Components/Body/styles/Body";
import Body from "../../Components/Body/Body";
import { RouteComponentProps } from "react-router-dom";

const Homepage: React.FC<RouteComponentProps> = ({ history }) => {
	const [generate, setGenerate] = useState("");
	const [generatedURL, setGeneratedURL] = useState<IGeneratedURL>();
	const [user] = useContext(UserContext);

	useEffect(() => {
		if (!user) history.replace("/user");
	}, []);

	const generateURL = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		const jwt = window.localStorage.getItem("jid");
		const requestBody = {
			url: generate,
		};
		await fetch("http://localhost:4000/createNew", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-type": "application/json",
				authorization: `bearer ${jwt}`,
			},
		})
			.then(value => value.json())
			.then(data => {
				console.log("data", data);
				let properURL =
					data.destination.includes("https://") || data.destination.includes("http://")
						? data.destination
						: `https://${data.destination}`;
				let generated: IGeneratedURL = {
					__v: data.__v,
					_id: data._id,
					createdAt: new Date(data.createdAt),
					creatorId: data.creatorId,
					destination: properURL,
					shortened: data.shortened,
					visitCount: data.visitCount,
					updatedAt: new Date(data.updatedAt),
				};
				setGeneratedURL(generated);
			})
			.catch(err => console.error(err));
	};

	useEffect(() => {
		if (!user) {
			fetch("http://localhost:4000/auth", {
				headers: {
					authorization: `bearer ${window.localStorage.getItem("jid")}`,
				},
			})
				.then(values => values.json())
				.then(data => console.log(data))
				.catch(e => console.log(e));
		}
	}, []);

	return (
		<Body>
			<Container>
				<Header>Short.it</Header>
				<LinkInputContainer>
					{generatedURL ? (
						<GeneratedLink
							href={`http://localhost:4000/visit?short=${generatedURL.shortened}&by=${user.userName}`}
							target="_blank"
						>
							{`short.it/${generatedURL.shortened}`}
						</GeneratedLink>
					) : (
						<>
							<LinkInput
								placeholder="Enter a valid URL..."
								value={generate}
								onChange={event => setGenerate(event.target.value)}
							/>
							<Iconwrapper>
								<BsLink size={50} />
							</Iconwrapper>
						</>
					)}
				</LinkInputContainer>
				<SubmitButton onClick={e => generateURL(e)}>Generate</SubmitButton>
			</Container>
		</Body>
	);
};

export default Homepage;
