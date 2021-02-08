import React, { useState } from "react";

import Courses from "./Courses";

import { BiSearchAlt } from "react-icons/bi";

import "../App.css";

// contains search bar and course listings
function Home({ addCourse, cart }) {
	// current search query state
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div>
			<div className="search-bar">
				<span className="search-icon">
					<BiSearchAlt size={26} />
				</span>
				<input
					className="search"
					autoCapitalize="none"
					autoComplete="off"
					spellCheck="false"
					type="text"
					tabIndex="0"
					placeholder="Search"
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
				/>
			</div>
			<Courses query={searchQuery} cart={cart} addCourse={addCourse} />
		</div>
	);
}

export default Home;
