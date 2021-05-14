import React, { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "../App.css";

import { Link } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";

function Cart({ cart, removeCourse }) {
	// view cart pop up window
	const [showModal, setShowModal] = useState(false);

	return (
		<div>
			<Button variant="outline-dark" onClick={() => setShowModal(true)}>
				View Cart
			</Button>
			<Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-lg">
						Course Cart
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{cart.length === 0 ? (
						<Alert variant="info">
							Your course cart is empty! Add courses by clicking on the "Add
							Cart" button under each course.
						</Alert>
					) : (
						cart.map(function(course, index) {
							return (
								<Alert
									key={index}
									variant="warning"
									onClose={() => removeCourse(course)}
									dismissible
								>
									<Alert.Heading>CIS {course.number}</Alert.Heading>
									<p>{course.title}</p>
								</Alert>
							);
						})
					)}

					<div className="checkout-button">
						<Button variant="success" block>
							<Link to="/checkout">
								<h5 className="link">Checkout</h5>
							</Link>
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export default Cart;
