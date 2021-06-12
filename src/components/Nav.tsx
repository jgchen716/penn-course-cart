import React from "react";
import Cart from "./Cart";
import { AiOutlineShoppingCart as CartIcon } from "react-icons/ai";
import { course } from "../App";

import "../App.css";

export type NavProps = {
	cart: course[];
	removeCourse: (c: course) => void;
	handleOnDragEnd: (r: any) => void;
}

// contains header and cart modal
function Nav(props: NavProps) {
	return (
		<div className="header">
			<h2>
				<span className="icon">
					<CartIcon />
				</span>
				<span>Penn Course Cart</span>
				<span className="course-modal">
					<Cart
						cart={props.cart}
						removeCourse={props.removeCourse}
						handleOnDragEnd={props.handleOnDragEnd}
					/>
				</span>
			</h2>
		</div>
	);
}

export default Nav;
