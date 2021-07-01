import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import { Body, Iconwrapper, Sidebar, Main } from "./styles/Body";
import { BsLink } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Logo from "../../Logo";
import { Link, useHistory } from "react-router-dom";

const BodyContainer: React.FC = ({ children }) => {
	const history = useHistory();
	const [user, setUser] = useContext(UserContext);
	const logout = () => {
		window.localStorage.removeItem("jid");
		history.replace("/user");
		setUser();
	};

	return (
		<Body>
			<Sidebar>
				<Link to="/">
					<Logo />
				</Link>
				<Link to="/user">
					<Iconwrapper title="User">
						<FaUserAlt size={50} />
					</Iconwrapper>
				</Link>
				<Link to="/">
					<Iconwrapper title="URL">
						<BsLink size={50} />
					</Iconwrapper>
				</Link>
				<Iconwrapper title="Log out" onClick={logout}>
					<FiLogOut size={50} />
				</Iconwrapper>
			</Sidebar>
			<Main>{children}</Main>
		</Body>
	);
};

export default BodyContainer;
