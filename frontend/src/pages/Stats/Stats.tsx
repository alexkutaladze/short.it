import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import Body from "../../Components/Body/Body";
import LinkComponent from "../../Components/LinkComponent/LinkComponent";
import { UserContext } from "../../Context/UserContext";
import { IGeneratedURL } from "../../types/IGeneratedURL";

const Stats: React.FC<RouteComponentProps> = ({ location, match, staticContext }) => {
	const [param, setParam] = useState("");
	const [mostVisited, setMostVisited] = useState<IGeneratedURL[]>();
	const [loading, setLoading] = useState(true);

	const [user] = useContext(UserContext);

	useEffect(() => {
		if (location.search) {
			let link = location.search.substr(1).split("=")[1];
			setParam(link);
			setLoading(false);
		} else {
			fetch("http://localhost:4000/mostVisitedLinks")
				.then(val => val.json())
				.then(data => {
					setMostVisited(data);
					setLoading(false);
				})
				.catch(e => {
					console.log(e);
					setLoading(false);
				});
		}
	}, [param]);

	return (
		<Body>
			{loading ? (
				<h1>Loading</h1>
			) : param ? (
				<div>{param}</div>
			) : (
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<h1>Top 5</h1>
					{mostVisited?.map(item => (
						<LinkComponent key={item._id} user={user} short={item} />
					))}
				</div>
			)}
		</Body>
	);
};

export default Stats;
