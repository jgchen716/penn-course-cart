import React, { useState, useEffect } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Checkout.css";

import Nav from "./components/Nav";
import Home from "./components/Home";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";

function App() {
	// top level cart state
	const [cart, setCart] = useState([]);

	// function to pass to children to add course
	const addCourse = (new_course) => {
		if (cart.length < 7 && !includesCourse(new_course)) {
			const newCart = [...cart, new_course];
			setCart(newCart);
		}
	};

	// function to pass to children to remove course
	const removeCourse = (course) => {
		const copy = [...cart];
		const index = copy.indexOf(course);
		if (index > -1) {
			copy.splice(index, 1);
		}
		setCart(copy);
	};

	// check whether course is currently in cart
	function includesCourse(course) {
		const name = course.title;
		const code = course.number;
		for (var i = 0; i < cart.length; i++) {
			if (cart[i].number === code && cart[i].title === name) {
				return true;
			}
		}
		return false;
	}

	useEffect(() => {
		setCart(cart);
	}, [cart]);

	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Nav cart={cart} removeCourse={removeCourse} />
					<div className="inner-container">
						<Home
							cart={cart}
							addCourse={addCourse}
							includesCourse={includesCourse}
						/>
					</div>
				</Route>
				<Route exact path="/checkout" component={Checkout}>
					<Checkout cart={cart} />
				</Route>
			</Switch>
		</Router>
	);
}

// very basic checkout receipt page
function Checkout({ cart }) {
	return (
		<>
			<h1>Course Receipt</h1>
			<ListGroup>
				{cart.map((course) => (
					<ListGroup.Item>
						<h5>CIS {course.number}</h5>
					</ListGroup.Item>
				))}
			</ListGroup>
		</>
	);
}

export default App;
