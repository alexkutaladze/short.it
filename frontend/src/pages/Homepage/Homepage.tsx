import React, { useState, useEffect } from "react";
import {
	Body,
	Sidebar,
	Iconwrapper,
	Main,
	Header,
	LinkInputContainer,
	LinkInput,
	SubmitButton,
	GeneratedLink,
} from "./style/Homepage";
import Logo from "../../Logo";
import { FaUserAlt } from "react-icons/fa";
import { BsLink } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { IGeneratedURL } from "../../types/IGeneratedURL";

const Homepage = () => {
	const [generate, setGenerate] = useState("");
	const [generatedURL, setGeneratedURL] = useState<IGeneratedURL>();

	const generateURL = async () => {
		const requestBody = {
			url: generate,
		};

		await fetch("http://localhost:4000/createNew", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-type": "application/json",
			},
		})
			.then(value => value.json())
			.then(data => {
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

	return (
		<Body>
			<Sidebar>
				<Logo />
				<Iconwrapper title="User">
					<FaUserAlt size={50} />
				</Iconwrapper>
				<Iconwrapper title="URL">
					<BsLink size={50} />
				</Iconwrapper>
				<Iconwrapper title="Log out">
					<FiLogOut size={50} />
				</Iconwrapper>
			</Sidebar>
			<Main>
				<Header>Short.it</Header>
				<LinkInputContainer>
					{generatedURL ? (
						<GeneratedLink
							href={`http://localhost:4000/visit/${generatedURL.shortened}`}
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
				<SubmitButton onClick={generateURL}>Generate</SubmitButton>
			</Main>
		</Body>
	);
};

export default Homepage;
