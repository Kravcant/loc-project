import { data } from "./data.js";

/**
 * ============================
 * Global DOM References
 * ============================
 */
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

/**
 * ============================
 * UI Helper Groups
 * ============================
 */
const contactFields = [
	pForm.selectFieldset.deanRef,
	pForm.selectFieldset.penRef,
	pForm.selectFieldset.locRef,
	pForm.selectFieldset.chairRef,
];

/**
 * Create shared contact edit button set
 */
const contactEditBtn = createButton("Edit");
const contactSaveBtn = createButton("Save");
const contactCancelBtn = createButton("Cancel");

pForm.selectFieldset.ref.append(
	contactEditBtn,
	contactSaveBtn,
	contactCancelBtn
);

/**
 * Creates a button element
 * @param {string} text Button label
 */
function createButton(text) {
	const btn = document.createElement("button");
	btn.type = "button";
	btn.textContent = text;
	return btn;
}

/**
 * ============================
 * Division Selector Setup
 * ============================
 */
function fillDivisionSelector() {
	data.departments.forEach((dep) => {
		const opt = document.createElement("option");
		opt.value = dep.divisionName;
		opt.textContent = dep.divisionName;
		pForm.selectFieldset.divisionSelector.appendChild(opt);
	});
}

/**
 * ============================
 * Field Enable/Disable Helpers
 * ============================
 */

/**
 * Disable contact fields (view-only)
 */
function greyOutContactInfo() {
	setEnabled(contactFields, false);
	contactEditBtn.style.display = "inline-block";
	contactSaveBtn.style.display = "none";
	contactCancelBtn.style.display = "none";
}

/**
 * Enables or disables a list of form elements
 */
function setEnabled(elements, enabled) {
	elements.forEach((el) => {
		el.disabled = !enabled;
		el.style.backgroundColor = enabled ? "" : "#eee";
		el.style.cursor = enabled ? "default" : "not-allowed";
	});
}

/**
 * Disable all inputs inside a program fieldset
 */
function greyOutProgramCard(fieldsetRef) {
	toggleProgramCard(fieldsetRef, false);
}

/**
 * Enable all inputs inside a program fieldset
 */
function enableProgramCard(fieldsetRef) {
	toggleProgramCard(fieldsetRef, true);
}

/**
 * Toggles interactive state of program card
 */
function toggleProgramCard(fieldsetRef, enabled) {
	fieldsetRef.querySelectorAll("input, textarea").forEach((el) => {
		el.disabled = !enabled;
		el.style.backgroundColor = enabled ? "" : "#eee";
		el.style.cursor = enabled ? "auto" : "not-allowed";
	});

	fieldsetRef.querySelectorAll(".remove-payee-btn").forEach((btn) => {
		btn.disabled = !enabled;
		btn.style.display = enabled ? "inline-block" : "none";
	});

	const addBtn = fieldsetRef.querySelector(".payee-container > div > button");
	if (addBtn) {
		addBtn.disabled = !enabled;
		addBtn.style.display = enabled ? "inline-block" : "none";
	}
}

/**
 * ============================
 * Program Card Rendering
 * ============================
 */

function clearProgramCards() {
	pForm.programsFieldset.ref.innerHTML = "";
}

/**
 * Renders program cards for selected division
 */
function createProgramCards(division) {
	clearProgramCards();

	if (!division) {
		contactEditBtn.style.display = "none";
		return;
	}

	contactEditBtn.style.display = "inline-block";

	division.programList.forEach((program) => {
		const fieldsetRef = buildProgramCard(program);
		pForm.programsFieldset.ref.appendChild(fieldsetRef);
		greyOutProgramCard(fieldsetRef);
	});
}

/**
 * Builds one program card (fieldset)
 */
function buildProgramCard(program) {
	const fieldsetRef = document.createElement("fieldset");
	fieldsetRef.id = `${program.programName.toLowerCase()}-program`;
	fieldsetRef.classList.add("program");

	fieldsetRef.appendChild(createProgramTitle(program));
	const payeeSection = createPayeeSection(program);
	fieldsetRef.appendChild(payeeSection);
	fieldsetRef.appendChild(createMoneySection(program));
	const notes = createNotesSection(program);
	fieldsetRef.appendChild(notes);
	fieldsetRef.appendChild(
		createProgramButtons(fieldsetRef, program, payeeSection, notes)
	);

	return fieldsetRef;
}

/**
 * UI builders (program card internals)
 */
function createProgramTitle(program) {
	const title = document.createElement("p");
	title.classList.add("p-title");
	title.textContent = program.programName;
	return title;
}

function createPayeeSection(program) {
	const section = document.createElement("section");
	section.classList.add("payee-container", "program-sections");

	const controlDiv = document.createElement("div");
	const addBtn = createButton("Add");
	controlDiv.appendChild(addBtn);
	section.appendChild(controlDiv);

	addBtn.onclick = () => addPayee(section, program.programName, controlDiv);

	Object.entries(program.payees).forEach(([name, amt]) =>
		addPayee(section, program.programName, controlDiv, name, amt)
	);

	return section;
}

function createMoneySection(program) {
	const fs = document.createElement("fieldset");
	fs.classList.add("program-money-section");

	fs.appendChild(createCheckbox("Has been paid", program, "hasBeenPaid"));
	fs.appendChild(document.createElement("hr"));
	fs.appendChild(createCheckbox("Submitted", program, "reportSubmitted"));

	return fs;
}

function createCheckbox(labelText, program, key) {
	const div = document.createElement("div");
	const label = document.createElement("label");
	label.textContent = labelText;
	const input = document.createElement("input");
	input.type = "checkbox";
	input.checked = program[key];
	div.append(label, input);
	return div;
}

function createNotesSection(program) {
	const fs = document.createElement("fieldset");
	fs.classList.add("program-notes-section");

	const label = document.createElement("label");
	label.textContent = "Notes";

	const textarea = document.createElement("textarea");
	textarea.value = program.notes || "";

	fs.append(label, textarea);
	return fs;
}

function createProgramButtons(fieldsetRef, program, payeeSection, notesField) {
	const container = document.createElement("div");
	container.classList.add("program-buttons");

	const editBtn = createButton("Edit");
	const saveBtn = createButton("Save Program");
	const cancelBtn = createButton("Cancel");

	container.append(editBtn, saveBtn, cancelBtn);

	saveBtn.style.display = "none";
	cancelBtn.style.display = "none";

	editBtn.onclick = () =>
		enterProgramEditMode(
			fieldsetRef,
			program,
			payeeSection,
			notesField,
			editBtn,
			saveBtn,
			cancelBtn
		);
	return container;
}

/**
 * Program Edit Mode handling
 */
function enterProgramEditMode(
	fieldsetRef,
	program,
	payeeSection,
	notesField,
	editBtn,
	saveBtn,
	cancelBtn
) {
	const originalState = captureProgramState(payeeSection, notesField, program);

	enableProgramCard(fieldsetRef);
	editBtn.style.display = "none";
	saveBtn.style.display = "inline-block";
	cancelBtn.style.display = "inline-block";

	cancelBtn.onclick = () =>
		restoreProgramState(
			originalState,
			fieldsetRef,
			payeeSection,
			notesField,
			program,
			editBtn,
			saveBtn,
			cancelBtn
		);
	saveBtn.onclick = () =>
		saveProgramState(
			payeeSection,
			notesField,
			program,
			fieldsetRef,
			editBtn,
			saveBtn,
			cancelBtn
		);
}

function captureProgramState(payeeSection, notesField, program) {
	return {
		notes: notesField.querySelector("textarea").value,
		payees: Object.fromEntries(
			[...payeeSection.querySelectorAll(".payee-item")].map((item) => {
				const name = item.querySelector("input[type=text]").value;
				const amt = item.querySelector("input[type=number]").value;
				return [name, amt];
			})
		),
		hasBeenPaid: program.hasBeenPaid,
		reportSubmitted: program.reportSubmitted,
	};
}

function restoreProgramState(
	state,
	fieldsetRef,
	payeeSection,
	notesField,
	program,
	editBtn,
	saveBtn,
	cancelBtn
) {
	notesField.querySelector("textarea").value = state.notes;
	payeeSection.querySelectorAll(".payee-item").forEach((el) => el.remove());

	for (const [name, amt] of Object.entries(state.payees)) {
		addPayee(
			payeeSection,
			program.programName,
			payeeSection.querySelector("div"),
			name,
			amt
		);
	}

	program.hasBeenPaid = state.hasBeenPaid;
	program.reportSubmitted = state.reportSubmitted;

	greyOutProgramCard(fieldsetRef);
	editBtn.style.display = "inline-block";
	saveBtn.style.display = "none";
	cancelBtn.style.display = "none";
}

function saveProgramState(
	payeeSection,
	notesField,
	program,
	fieldsetRef,
	editBtn,
	saveBtn,
	cancelBtn
) {
	program.notes = notesField.querySelector("textarea").value;
	program.payees = {};

	payeeSection.querySelectorAll(".payee-item").forEach((item) => {
		const name = item.querySelector("input[type=text]").value;
		const amt = item.querySelector("input[type=number]").value;
		program.payees[name] = amt;
	});

	greyOutProgramCard(fieldsetRef);
	editBtn.style.display = "inline-block";
	saveBtn.style.display = "none";
	cancelBtn.style.display = "none";
}

/**
 * ============================
 * Payee Helpers
 * ============================
 */
function addPayee(section, programName, controlDiv, name = "", amount = "") {
	const index = section.querySelectorAll(".payee-item").length + 1;

	const wrapper = document.createElement("div");
	wrapper.classList.add("payee-item");

	const label = document.createElement("label");
	label.textContent = `Payee #${index}`;

	const inputRow = document.createElement("div");
	inputRow.classList.add("program-payee-input-section");

	const nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.value = name;

	const amountInput = document.createElement("input");
	amountInput.type = "number";
	amountInput.value = amount;

	const removeBtn = createButton("Remove");
	removeBtn.classList.add("remove-payee-btn");
	removeBtn.onclick = () => {
		wrapper.remove();
		updatePayeeNumbers(section);
	};

	inputRow.append(nameInput, amountInput, removeBtn);
	wrapper.append(label, inputRow);

	section.insertBefore(wrapper, controlDiv);
}

function updatePayeeNumbers(section) {
	section.querySelectorAll(".payee-item").forEach((div, i) => {
		div.querySelector("label").textContent = `Payee #${i + 1}`;
	});
}

/**
 * ============================
 * Contact Info Handling
 * ============================
 */
contactEditBtn.onclick = () => {
	const originalState = captureContactState();
	setEnabled(contactFields, true);

	contactEditBtn.style.display = "none";
	contactSaveBtn.style.display = "inline-block";
	contactCancelBtn.style.display = "inline-block";

	contactCancelBtn.onclick = () => restoreContactState(originalState);
	contactSaveBtn.onclick = saveContactState;
};

function captureContactState() {
	return {
		dean: pForm.selectFieldset.deanRef.value,
		pen: pForm.selectFieldset.penRef.value,
		loc: pForm.selectFieldset.locRef.value,
		chair: pForm.selectFieldset.chairRef.value,
	};
}

function restoreContactState(state) {
	Object.assign(selectedDivision, state);
	updateContactInfo(selectedDivision.divisionName);
	greyOutContactInfo();
}

function saveContactState() {
	Object.assign(selectedDivision, {
		deanName: pForm.selectFieldset.deanRef.value,
		penContact: pForm.selectFieldset.penRef.value,
		locRep: pForm.selectFieldset.locRef.value,
		chairName: pForm.selectFieldset.chairRef.value,
	});
	greyOutContactInfo();
}

function updateContactInfo(name) {
	const dept = data.departments.find((d) => d.divisionName === name);
	selectedDivision = dept;

	if (!dept) {
		setEnabled(contactFields, false);
		contactFields.forEach((el) => (el.value = ""));
		return;
	}

	pForm.selectFieldset.deanRef.value = dept.deanName;
	pForm.selectFieldset.penRef.value = dept.penContact;
	pForm.selectFieldset.locRef.value = dept.locRep;
	pForm.selectFieldset.chairRef.value = dept.chairName;

	setEnabled(contactFields, false);
}

function updateProgramCards(name) {
	const dept = data.departments.find((d) => d.divisionName === name);
	createProgramCards(dept);
}

/**
 * ============================
 * Initialization
 * ============================
 */
fillDivisionSelector();
clearProgramCards();
greyOutContactInfo();

pForm.selectFieldset.divisionSelector.addEventListener("change", function () {
	updateContactInfo(this.value);
	updateProgramCards(this.value);
});
