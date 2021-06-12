export type courseType = {
	dept: string;
	number: number;
	title: string;
	prereqs?: string[];
	'cross-listed'?: string[];
	description: string;
}

export type meetingType = {
    building_code: string;
    building_name: string;
    end_hour_24: number;
    end_minutes: number;
    end_time: string;
    end_time_24: number;
    meeting_days: string;
    room_number: string;
    section_id: string;
    section_id_normalized: string;
    start_hour_24: number;
    start_minutes: number;
    start_time: string;
    start_time_24: number;
    term: string;
}

export type apiCourse = {
    meetings: meetingType[];
    instructors: string[];
    credit_and_grade_type: string;
}

export type appStateType = {
	loading: boolean;
	courses: Map<string, any>;
}

export type instructor = {
	name: string;
	section_id: string;
	term: string;
}