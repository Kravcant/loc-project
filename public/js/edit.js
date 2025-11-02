import { Department } from "./department.js";
import { Program } from "./program.js";
import { data } from "./data.js";

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

	/*
    // Find and update the department
    const dept = form.departments.find(
        (d) => d.getDivName() === divisionSelect.value
    );

    if (!dept) {
        alert("Department not found!");
        return; // ← This is the important return!
    }

    // Update department data
    dept.setChairName(chairRef.value.trim());
    dept.setDeanName(deanRef.value.trim());
    dept.setLocRep(locRef.value.trim());
    dept.setPenContact(penRef.value.trim());
    */
}

// new-edit.js or add to existing script file
document.addEventListener("DOMContentLoaded", function () {
	// Event delegation for Add and Remove buttons
	document.addEventListener("click", function (e) {
		const button = e.target;

		// Check if Add button was clicked
		if (button.textContent === "Add" && button.closest(".payee-container")) {
			e.preventDefault();
			addPayee(button);
		}

		// Check if Remove button was clicked
		if (button.textContent === "Remove" && button.closest(".payee-container")) {
			e.preventDefault();
			removePayee(button);
		}
	});

	function addPayee(button) {
		// Find the payee container
		const payeeContainer = button.closest(".payee-container");
		const programId = payeeContainer.id.replace("-payee-container", "");

		console.log("Program ID:", programId); // Add this line

		// Count existing payees
		const existingPayees = payeeContainer.querySelectorAll(
			'label[for*="payee"]'
		);
		const newPayeeNumber = existingPayees.length + 1;

		// Create new payee section
		const newPayeeLabel = document.createElement("label");
		newPayeeLabel.setAttribute("for", `${programId}-payee-${newPayeeNumber}`);
		newPayeeLabel.textContent = `Payee #${newPayeeNumber}`;

		const newInputSection = document.createElement("div");
		newInputSection.className = "program-payee-input-section";
		newInputSection.innerHTML = `
            <input
                type="text"
                name="${programId}-payee-${newPayeeNumber}"
                id="${programId}-payee-${newPayeeNumber}"
                placeholder="John Smith"
            />
            <input
                type="number"
                name="${programId}-payee-${newPayeeNumber}-money"
                id="${programId}-payee-${newPayeeNumber}-money"
                placeholder="Amount"
                step="0.01"
            />
        `;

		// Insert before the button container
		const buttonContainer = payeeContainer.querySelector("div:last-child");
		payeeContainer.insertBefore(newPayeeLabel, buttonContainer);
		payeeContainer.insertBefore(newInputSection, buttonContainer);
	}

	function removePayee(button) {
		const payeeContainer = button.closest(".payee-container");
		const payeeLabels = payeeContainer.querySelectorAll('label[for*="payee"]');

		// Don't remove if only one payee exists
		if (payeeLabels.length <= 1) {
			alert("You must have at least one payee.");
			return;
		}

		// Remove the last payee (label and input section)
		const lastLabel = payeeLabels[payeeLabels.length - 1];
		const inputSections = payeeContainer.querySelectorAll(
			".program-payee-input-section"
		);
		const lastInputSection = inputSections[inputSections.length - 1];

		lastLabel.remove();
		lastInputSection.remove();
	}
});

// Function to add event listners for everything inside the form
function addEventListeners() {
	const divisionSelect = form.inputFields.get("division");
	const saveBtn = form.btns.get("save");
	const cancelBtn = form.btns.get("cancel");

	divisionSelect.addEventListener("change", handleDivisionChange);
	saveBtn.addEventListener("click", saveEdits);
	/*
	cancelBtn.addEventListener("click", cancelEdits);
    */
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

// Function to save the edits, this will be called on clicked
function saveEdits() {
	// Get all input fields from the form map
	const divisionSelect = form.inputFields.get("division");
	const chairRef = form.inputFields.get("chair");
	const deanRef = form.inputFields.get("dean");
	const locRef = form.inputFields.get("loc");
	const penRef = form.inputFields.get("pen");

	/*
    console.log("Selected Division:", selectedDivision);
    console.log("Selected Division Length:", selectedDivision.length);
    */

	/*
	let selectedDivision = divisionSelect.value.trim();
    */

	const selectedDivision = divisionSelect.value.trim();
	console.log("🔍 Save clicked");
	console.log("Selected Division:", selectedDivision);
	console.log(
		"All divisions:",
		form.departments.map((d) => d.getDivName())
	);

	// --- Input Validation ---
	let isValid = true;

	// Validate each input field
	if (chairRef.value.trim() === "") {
		isValid = false;
		document.getElementById("err-chair").style.display = "inline";
	} else {
		document.getElementById("err-chair").style.display = "none";
	}

	if (deanRef.value.trim() === "") {
		isValid = false;
		document.getElementById("err-dean").style.display = "inline";
	} else {
		document.getElementById("err-dean").style.display = "none";
	}

	if (locRef.value.trim() === "") {
		isValid = false;
		document.getElementById("err-loc").style.display = "inline";
	} else {
		document.getElementById("err-loc").style.display = "none";
	}

	if (penRef.value.trim() === "") {
		isValid = false;
		document.getElementById("err-pen").style.display = "inline";
	} else {
		document.getElementById("err-pen").style.display = "none";
	}

	// If not valid, exit
	if (!isValid) {
		return;
	}

	// If valid, continue saving edits

	/*
    const dept = form.departments.find(
        (d) => {
            const divName = d.getDivName();
            console.log(`Comparing "${divName}" with "${selectedDivision}"`);
            return divName && divName === selectedDivision;
        }
    );
    */

	// Update department data
	form.departments.forEach((dept) => {
		if (dept.getDivName() === selectedDivision) {
			dept.setChairName(chairRef.value);
			dept.setDeanName(deanRef.value);
			dept.setLocRep(locRef.value);
			dept.setPenContact(penRef.value);
		}
	});
}

function clearInputs() {
	form.fieldsArr.forEach((el) => (el.value = ""));
}
