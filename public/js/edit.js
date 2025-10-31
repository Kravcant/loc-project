import { Department } from "./department.js";

const form = {
	ref: document.getElementById("form"),
	inputFields: new Map([
		["division", document.getElementById("division")],
        ["programs", document.getElementById("programs")],
        ["chair", document.getElementById("chair-input")],
		["dean", document.getElementById("dean-input")],
		["loc", document.getElementById("loc-input")],
        ["pen", document.getElementById("pen-input")],
	]),
	fieldsArr: document.querySelectorAll(".input-fields"),
    /*
	btns: new Map([
		["save", document.getElementById("save-btn")],
		["cancel", document.getElementById("cancel-btn")],
	]),
    */
	departments: [
        new Department(
			"",
            [""],
            "",
			"",
            "",
			""
		),
		new Department(
			"Fine Arts",
            ["Music"],
            "Paul Metevier",
			"Christie Gilliland",
            "Monica Bowen",
			"Liz Peterson"
		),
        new Department(
			"Humanities",
            ["Communication Studies"],
            "Katie Cunnion",
			"Jamie Fitzgerald",
            "Lisa Luengo",
			"Liz Peterson"
		),
        new Department(
			"Social Science",
            ["Anthropology", "History", "Political Science", "Psycology"],
            "Mark Thomason",
			"Christie Gilliland",
            "Joy Crawford",
			"Liz Peterson"
		),
	],
};

