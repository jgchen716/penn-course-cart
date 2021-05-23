import React, { useEffect, useState } from "react";

import courses from "../data/courses";

import "../App.css";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { FaCartPlus } from "react-icons/fa";

function Courses({ query, addCourse, cart, apiData }) {
	// state for processed api data
	let [courseData, setCourseData] = useState(new Map());

	useEffect(() => {
		let updatedMap = new Map();
		if (apiData.length !== 0) {
			// process api data
			for (var j = 0; j < apiData.courses.length; j++) {
				let item = apiData.courses[j];
				const key = item.course_number.concat(item.activity);

				let val;
				if (updatedMap.has(key)) {
					// update instructors
					val = updatedMap.get(key);
					const instructors = val.instructors;
					const newInstructors = item.instructors;

					for (var i = 0; i < newInstructors.length; i++) {
						if (!instructors.includes(newInstructors[i])) {
							instructors.push(newInstructors[i]);
						}
					}
					val.instructors = instructors;
				} else {
					val = {
						instructors: item.instructors,
						requirements: item.fulfills_college_requirements,
						credits: item.credits,
						recitations: item.recitations,
						notes: item.important_notes,
					};
				}
				updatedMap.set(key, val);
			}
		}
		setCourseData(updatedMap);
	}, [courseData]);

	// search results
	const [searchResults, setSearchResults] = useState([]);

	// filter by search query
	useEffect(() => {
		const results = courses.filter(function(course) {
			const code_no_space = "CIS" + course.number.toString();
			const code_with_space = "CIS " + course.number.toString();
			if (
				code_no_space.toLowerCase().includes(query) ||
				code_with_space.toLowerCase().includes(query) ||
				course.title.toLowerCase().includes(query) ||
				course.description.toLowerCase().includes(query)
			) {
				return true;
			} else if (course.hasOwnProperty("prereqs")) {
				if (typeof course.prereqs === "string") {
					if (course.prereqs.toLowerCase().includes(query)) {
						return true;
					}
				} else {
					if (course.prereqs.join("").includes(query)) {
						return true;
					}
				}
			} else if (
				course.hasOwnProperty("cross-listed") &&
				course["cross-listed"]
					.join("")
					.toLowerCase()
					.includes(query)
			) {
				return true;
			}
			return false;
		});
		setSearchResults(results);
	}, [query]);

	return (
		<div className="courses">
			<Accordion defaultActiveKey="0">
				{searchResults.map(function(course, index) {
					return (
						<div
							className="course-card"
							key={`${course.dept}-${course.number}`}
						>
							<Card key={index} bg={cart.includes(course) ? "warning" : ""}>
								<Accordion.Toggle as={Card.Header} eventKey={course.number}>
									<span className="course-subheading course-code">
										{course.dept} {course.number}{" "}
									</span>

									{course.title}
								</Accordion.Toggle>
								<Accordion.Collapse eventKey={course.number}>
									<Card.Body>
										{course.prereqs != null ? (
											<p>
												<span className="course-subheading">
													Prerequisites:{" "}
												</span>
												{typeof course.prereqs === "string"
													? course.prereqs
													: course.prereqs.join(", ")}
											</p>
										) : (
											<p>
												<span className="course-subheading">
													Prerequisites:{" "}
												</span>
												N/A
											</p>
										)}
										{course["cross-listed"] != null ? (
											<p>
												<span className="course-subheading">
													Cross-listings:{" "}
												</span>
												{course["cross-listed"].join(", ")}
											</p>
										) : null}
										{courseData && (
											<p>
												<span className="course-subheading">
													Current Instructor(s):{" "}
												</span>
												{}
											</p>
										)}

										<p>
											<span className="course-subheading">Description: </span>
											{course.description}
										</p>
										<Button
											id={course.number}
											variant="outline-success"
											size="lg"
											block
											onClick={() => addCourse(course)}
											value={course.title}
											disabled={cart.includes(course)}
										>
											{" "}
											<FaCartPlus />{" "}
											<span className="add-cart">Add to Cart</span>
										</Button>
									</Card.Body>
								</Accordion.Collapse>
							</Card>
						</div>
					);
				})}
			</Accordion>
		</div>
	);
}

export default Courses;
