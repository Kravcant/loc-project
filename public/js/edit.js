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
	btns: new Map([
		["save", document.getElementById("save-btn")],
		["cancel", document.getElementById("cancel-btn")],
	]),
	departments: [
        /*
        new Department(
			"",
            [""],
            "",
			"",
            "",
			""
		),
        */
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

// Initialize the dropdown code
populateDepartmentDropdown();
addEventListeners();
form.ref.addEventListener("submit", function (event) {
	event.preventDefault(); // Prevent form from actually submitting
});

// Function to populate the dropdowns
function populateDepartmentDropdown() {
	const divisionSelect = form.inputFields.get("division");

	form.departments.forEach((dept) => {
		const option = document.createElement("option");
		option.value = dept.getDivName();
		option.textContent = dept.getDivName();
		divisionSelect.appendChild(option);
	});
}

// Function to add event listners for everything inside the form
function addEventListeners() {
	const divisionSelect = form.inputFields.get("division");
	const saveBtn = form.btns.get("save");
	const cancelBtn = form.btns.get("cancel");

	divisionSelect.addEventListener("change", handleDivisionChange);
	saveBtn.addEventListener("click", saveEdits);
	cancelBtn.addEventListener("click", cancelEdits);
}

// Event handlers
function handleDivisionChange() {
	const divisionSelect = form.inputFields.get("division");
	const selectedDivision = divisionSelect.value;

	if (selectedDivision === "default") {
		clearInputs(); // Call in case there is something in the inputs
		return;
	}

	// Lookup and store the department reference that matches our select value
	const dept = form.departments.find(
		(d) => d.getDivName() === selectedDivision
	);

	// If we found a match, then fill the fields with the correct info for the dept.
	if (dept) {
        form.inputFields.get("chair").value = dept.getChairName();
		form.inputFields.get("dean").value = dept.getDeanName();
        form.inputFields.get("loc").value = dept.getLocRep();
		form.inputFields.get("pen").value = dept.getPenContact();
	}
}