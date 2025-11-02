import { Department } from "./department.js";
import { Program } from "./program.js";
import { data } from "./data.js";

// ============================
// Global References
// ============================
const pForm = {
	ref: document.getElementById("page-form"),

	selectFieldset: {
		ref: document.getElementById("div-select-set"),
		divisionSelector: document.getElementById("division-select"),

		deanRef: document.getElementById("dean-input"),
		deanErrRef: document.getElementById("err-dean"),

		penRef: document.getElementById("pen-input"),
		penErrRef: document.getElementById("err-pen"),

		locRef: document.getElementById("loc-input"),
		locErrRef: document.getElementById("err-loc"),

		chairRef: document.getElementById("chair-input"),
		chairErrRef: document.getElementById("err-chair"),
	},

	programsFieldset: {
		ref: document.getElementById("programs-container"),
	},
};

let selectedDivision = data.departments[0];

// ============================
// Division Selector Population
// ============================
function fillDivisionSelector() {
	const divSelector = pForm.selectFieldset.divisionSelector;
	data.departments.forEach((dep) => {
		const opt = document.createElement("option");
		opt.value = dep.divisionName;
		opt.textContent = dep.divisionName;
		divSelector.appendChild(opt);
	});
}

// ============================
// Program Cards Handling
// ============================
function clearProgramCards() {
	pForm.programsFieldset.ref.innerHTML = "";
}

function createProgramCards(selectedDivision) {
	const parent = pForm.programsFieldset.ref;
	clearProgramCards();
	if (!selectedDivision) return;

	selectedDivision.programList.forEach((pro) => {
		const fieldsetRef = document.createElement("fieldset");
		fieldsetRef.id = `${pro.programName.toLowerCase()}-program`;
		fieldsetRef.classList.add("program");

		// Title
		const programTitleRef = document.createElement("p");
		programTitleRef.classList.add("p-title");
		programTitleRef.textContent = pro.programName;
		fieldsetRef.appendChild(programTitleRef);

		// Payee Section
		const payeeSection = document.createElement("section");
		payeeSection.id = `${pro.programName.toLowerCase()}-program-payee-container`;
		payeeSection.classList.add("payee-container", "program-sections");

		let payeeNumber = 1;
		for (const [payeeName, payeeAmount] of Object.entries(pro.payees)) {
			const payeeDiv = createPayeeDiv(
				pro.programName,
				payeeNumber,
				payeeName,
				payeeAmount,
				fieldsetRef
			);
			payeeSection.appendChild(payeeDiv);
			payeeNumber++;
		}

		// Add Payee Button
		const addPayeeDiv = document.createElement("div");
		const addPayeeBtn = document.createElement("button");
		addPayeeBtn.type = "button";
		addPayeeBtn.textContent = "Add";
		addPayeeBtn.addEventListener("click", () =>
			addPayee(payeeSection, pro.programName, fieldsetRef)
		);
		addPayeeDiv.appendChild(addPayeeBtn);
		payeeSection.appendChild(addPayeeDiv);

		fieldsetRef.appendChild(payeeSection);

		// Paid Section
		const moneyFieldset = document.createElement("fieldset");
		moneyFieldset.classList.add("program-money-section");

		const paidDiv = document.createElement("div");
		const paidLabel = document.createElement("label");
		paidLabel.htmlFor = `${pro.programName.toLowerCase()}-paid`;
		paidLabel.textContent = "Has been paid";

		const paidInput = document.createElement("input");
		paidInput.type = "checkbox";
		paidInput.id = `${pro.programName.toLowerCase()}-paid`;
		paidInput.checked = pro.hasBeenPaid;
		paidInput.addEventListener("change", () => showSubmitChanges(fieldsetRef));

		paidDiv.append(paidLabel, paidInput);
		moneyFieldset.appendChild(paidDiv);
		fieldsetRef.appendChild(moneyFieldset);

		// Notes Section
		const notesFieldset = document.createElement("fieldset");
		notesFieldset.classList.add("program-notes-section");

		const notesLabel = document.createElement("label");
		notesLabel.htmlFor = `${pro.programName.toLowerCase()}-notes`;
		notesLabel.textContent = "Notes";

		const notesTextarea = document.createElement("textarea");
		notesTextarea.id = `${pro.programName.toLowerCase()}-notes`;
		notesTextarea.value = pro.notes || "";
		notesTextarea.addEventListener("input", () =>
			showSubmitChanges(fieldsetRef)
		);

		notesFieldset.append(notesLabel, notesTextarea);
		fieldsetRef.appendChild(notesFieldset);

		// Submit Changes Button
		const btnContainer = document.createElement("div");
		btnContainer.classList.add("program-buttons");

		const submitChangesBtn = document.createElement("button");
		submitChangesBtn.type = "button";
		submitChangesBtn.classList.add("button");
		submitChangesBtn.textContent = "Submit Changes";
		submitChangesBtn.style.display = "none"; // hidden by default

		submitChangesBtn.addEventListener("click", () => {
			saveProgram(selectedDivision, pro.programName);
			submitChangesBtn.style.display = "none";
		});

		btnContainer.appendChild(submitChangesBtn);
		fieldsetRef.appendChild(btnContainer);

		// Track changes for inputs
		fieldsetRef
			.querySelectorAll("input[type=text], input[type=number]")
			.forEach((el) => {
				el.addEventListener("input", () => showSubmitChanges(fieldsetRef));
			});

		parent.appendChild(fieldsetRef);
	});
}

// ============================
// Payee Handling
// ============================
function createPayeeDiv(
	programName,
	payeeNumber,
	payeeName,
	payeeAmount,
	fieldsetRef
) {
	const payeeDiv = document.createElement("div");
	payeeDiv.classList.add("payee-item");
	payeeDiv.dataset.payeeNumber = payeeNumber;

	const label = document.createElement("label");
	label.htmlFor = `${programName.toLowerCase()}-payee-${payeeNumber}`;
	label.textContent = `Payee #${payeeNumber}`;

	const inputSection = document.createElement("div");
	inputSection.classList.add("program-payee-input-section");

	const nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.id = `${programName.toLowerCase()}-payee-${payeeNumber}`;
	nameInput.value = payeeName;

	const moneyInput = document.createElement("input");
	moneyInput.type = "number";
	moneyInput.id = `${programName.toLowerCase()}-payee-${payeeNumber}-money`;
	moneyInput.value = payeeAmount;

	nameInput.addEventListener("input", () => showSubmitChanges(fieldsetRef));
	moneyInput.addEventListener("input", () => showSubmitChanges(fieldsetRef));

	inputSection.append(nameInput, moneyInput);

	const removeBtn = document.createElement("button");
	removeBtn.type = "button";
	removeBtn.textContent = "Remove";
	removeBtn.addEventListener("click", () => {
		payeeDiv.remove();
		renumberPayees(fieldsetRef);
		showSubmitChanges(fieldsetRef);
	});

	inputSection.appendChild(removeBtn);
	payeeDiv.append(label, inputSection);

	return payeeDiv;
}

function addPayee(payeeSection, programName, fieldsetRef) {
	const payeeNumber = payeeSection.querySelectorAll(".payee-item").length + 1;
	const payeeDiv = createPayeeDiv(programName, payeeNumber, "", 0, fieldsetRef);
	const addBtnDiv = payeeSection.querySelector("div:last-child");
	payeeSection.insertBefore(payeeDiv, addBtnDiv);

	showSubmitChanges(fieldsetRef);
}

function renumberPayees(fieldsetRef) {
	const payees = fieldsetRef.querySelectorAll(".payee-item");
	payees.forEach((payeeDiv, index) => {
		const newNumber = index + 1;
		payeeDiv.dataset.payeeNumber = newNumber;
		const label = payeeDiv.querySelector("label");
		label.textContent = `Payee #${newNumber}`;
		const nameInput = payeeDiv.querySelector("input[type=text]");
		const moneyInput = payeeDiv.querySelector("input[type=number]");
		nameInput.id = `${fieldsetRef.id}-payee-${newNumber}`;
		moneyInput.id = `${fieldsetRef.id}-payee-${newNumber}-money`;
	});
}

// ============================
// Submit Changes Visibility
// ============================
function showSubmitChanges(fieldsetRef) {
	const submitBtn = fieldsetRef.querySelector(".button");
	submitBtn.style.display = "inline-block";
}

// ============================
// Save Program Functionality
// ============================
function saveProgram(department, programName) {
	const program = department.programList.find(
		(p) => p.programName === programName
	);
	if (!program) return;

	const programCard = document.getElementById(
		`${programName.toLowerCase()}-program`
	);

	// Update payees
	const payeeItems = programCard.querySelectorAll(".payee-item");
	program.payees = {};
	payeeItems.forEach((item) => {
		const nameInput = item.querySelector("input[type=text]");
		const moneyInput = item.querySelector("input[type=number]");
		if (nameInput.value.trim()) {
			program.payees[nameInput.value.trim()] =
				parseFloat(moneyInput.value) || 0;
		}
	});

	// Update paid status
	program.hasBeenPaid = programCard.querySelector(
		`#${programName.toLowerCase()}-paid`
	).checked;

	// Update notes
	program.notes = programCard.querySelector(
		`#${programName.toLowerCase()}-notes`
	).value;

	alert(`Program "${programName}" changes saved successfully!`);
}

// ============================
// Contact Info Update
// ============================
function toggleEnabled(toggle, elements) {
	elements.forEach((el) => (el.disabled = !toggle));
}

function updateContactInfo(depName) {
	const fields = pForm.selectFieldset;

	if (!depName) {
		fields.deanRef.value = "";
		fields.penRef.value = "";
		fields.locRef.value = "";
		fields.chairRef.value = "";

		toggleEnabled(false, [
			fields.deanRef,
			fields.penRef,
			fields.locRef,
			fields.chairRef,
		]);
		return;
	}

	const dept = data.departments.find((d) => d.divisionName === depName);
	selectedDivision = dept;
	if (!dept) return;

	fields.deanRef.value = dept.deanName;
	fields.penRef.value = dept.penContact;
	fields.locRef.value = dept.locRep;
	fields.chairRef.value = dept.chairName;

	toggleEnabled(true, [
		fields.deanRef,
		fields.penRef,
		fields.locRef,
		fields.chairRef,
	]);
}

function updateProgramCards(depName) {
	const dept = data.departments.find((d) => d.divisionName === depName);
	createProgramCards(dept);
}

// ============================
// Initialization
// ============================
fillDivisionSelector();
clearProgramCards();

pForm.selectFieldset.divisionSelector.addEventListener("change", function () {
	updateContactInfo(this.value);
	updateProgramCards(this.value);
});
