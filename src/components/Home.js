import React, { useState } from "react";

import Courses from "./Courses";

import "../App.css";

// contains search bar and course listings
function Home({ addCourse, cart, courseMap }) {
	// current search query state
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div>
			<div className="search-bar">
				<form>
					<input
						className="search"
						autoCapitalize="none"
						autoComplete="off"
						spellCheck="false"
						type="text"
						tabIndex="0"
						placeholder="Search for a course"
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
					/>
				</form>
			</div>
			<Courses
				query={searchQuery}
				cart={cart}
				addCourse={addCourse}
				courseMap={courseMap}
			/>
		</div>
	);
}

export default Home;
