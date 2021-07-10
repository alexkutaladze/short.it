import React from "react";
import { IGeneratedURL } from "../../types/IGeneratedURL";
import { IUser } from "../../types/IUser";
import { Analytics, AnalyticsVisits, AnalyticsWebsite } from "../../pages/User/styles/User";
import { BiGlobe } from "react-icons/bi";

interface Props {
	short: IGeneratedURL;
	user: IUser;
}

const LinkComponent: React.FC<Props> = ({ short, user }) => {
	return (
		<Analytics>
			<BiGlobe size={40} />
			<AnalyticsWebsite>
				<p>{short.destination}</p>
				<a
					href={`http://localhost:4000/visit?short=${short.shortened}&by=${
						user ? user.userName : "anon"
					}`}
					target="_blank"
					rel="noreferrer"
					style={{ display: "block" }}
				>
					{short.shortened}
				</a>
			</AnalyticsWebsite>
			<AnalyticsVisits>
				<p>
					<span>{short.visitCount}</span>
					<br />
					visits
				</p>
			</AnalyticsVisits>
		</Analytics>
	);
};

export default LinkComponent;
