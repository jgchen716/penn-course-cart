export interface course {
	dept: string;
	number: number;
	title: string;
    prereqs?: string[] | undefined;
    "cross-listed"?: string[];
    description: string;
}

export type addRemoveCourse = (c: course) => void;

export type NavProps = {
	cart: course[];
	removeCourse: addRemoveCourse;
	handleOnDragEnd: (a: any) => void;
}
