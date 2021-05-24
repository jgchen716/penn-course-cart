import React, { useEffect, useState } from "react";

import courses from "../data/courses";
import "../App.css";

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { FaCartPlus } from "react-icons/fa";

import axios from "axios";

function Courses({ query, addCourse, cart, courseMap }) {
	// state for API data
	const [courseData, setCourseData] = useState(null);
	// boolean to check whether or not button has been clicked
	let fetched = false;

	// API Endpoint
	const apiEndpoint = "https://api.pennlabs.org/registrar/search?q=cis";

	// read data from labs API
	const fetchData = async () => {
		const response = await axios.get(apiEndpoint);
		const data = response.data;

		if (!data) {
			setCourseData(null);
		} else {
			const map = new Map();
			const courses = data.courses;
			for (var i = 0; i < courses.length; i++) {
				let item = courses[i];
				const key = item.course_number.concat(item.activity);

				let val;
				if (map.has(key)) {
					// update instructors
					val = map.get(key);
					const instructors = val.instructors;
					const newInstructors = item.instructors;

					for (var j = 0; j < newInstructors.length; j++) {
						if (!instructors.includes(newInstructors[j])) {
							instructors.push(newInstructors[j]);
						}
					}
					val.instructors = instructors;
				} else {
					//TODO: FIX THIS
					val = {
						instructors: item.instructors,
						requirements: item.fulfills_college_requirements,
						recitations: item.recitations,
						notes: item.important_notes,
					};
				}
				map.set(key, val);
			}
		}

		setCourseData(courses[0]);
		fetched = true;
	};

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
		<div>
			<div>
				<Button variant="outline-success" size="lg" onClick={fetchData} block>
					See Course Info for Current Semester
				</Button>
				<div className="books">{courseData && courseData.course_number}</div>
			</div>
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
											{courseMap && (
												<p>
													<span className="course-subheading">
														Current Instructor(s):{" "}
													</span>
													{courseMap
														.get(courseMap.keys().next().value)
														.keys()
														.join(",")}
												</p>
											)}
											<p>
												<span className="course-subheading">Description: </span>
												{course.description}
											</p>
											<Tabs
												defaultActiveKey="lecture"
												id="uncontrolled-tab-example"
											>
												<Tab eventKey="lecture" title="Lecture">
													Lecture
												</Tab>
												<Tab eventKey="recitation" title="Recitation">
													Recitation
												</Tab>
											</Tabs>
											<div className="add-cart-wrapper">
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
											</div>
										</Card.Body>
									</Accordion.Collapse>
								</Card>
							</div>
						);
					})}
				</Accordion>
			</div>
		</div>
	);
}

export default Courses;
