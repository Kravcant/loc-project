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
// Grey Out / Enable Helpers
// ============================
const contactFields = [
	pForm.selectFieldset.deanRef,
	pForm.selectFieldset.penRef,
	pForm.selectFieldset.locRef,
	pForm.selectFieldset.chairRef,
];

// Contact buttons
const contactBtnContainer = document.createElement("div");
contactBtnContainer.classList.add("contact-buttons");

const contactEditBtn = document.createElement("button");
contactEditBtn.type = "button";
contactEditBtn.textContent = "Edit";

const contactSaveBtn = document.createElement("button");
contactSaveBtn.type = "button";
contactSaveBtn.textContent = "Save";

const contactCancelBtn = document.createElement("button");
contactCancelBtn.type = "button";
contactCancelBtn.textContent = "Cancel";

contactBtnContainer.append(contactEditBtn, contactSaveBtn, contactCancelBtn);
pForm.selectFieldset.ref.appendChild(contactBtnContainer);

// Contact helpers
function greyOutContactInfo() {
	contactFields.forEach((el) => {
		el.disabled = true;
		el.style.backgroundColor = "#eee";
		el.style.cursor = "not-allowed";
	});
	contactEditBtn.style.display = "none";
	contactSaveBtn.style.display = "none";
	contactCancelBtn.style.display = "none";
}

function enableContactEditBtn() {
	contactEditBtn.style.display = "inline-block";
}

// Program helpers
function greyOutProgramCard(fieldsetRef) {
	fieldsetRef.querySelectorAll("input, textarea").forEach((el) => {
		el.disabled = true;
		el.style.backgroundColor = "#eee";
		el.style.cursor = "not-allowed";
	});
	fieldsetRef.querySelectorAll(".remove-payee-btn").forEach((btn) => {
		btn.disabled = true;
		btn.style.display = "none";
	});
	const addBtn = fieldsetRef.querySelector(".payee-container > div > button");
	if (addBtn) {
		addBtn.disabled = true;
		addBtn.style.display = "none";
	}
}

function enableProgramCard(fieldsetRef) {
	fieldsetRef.querySelectorAll("input, textarea").forEach((el) => {
		el.disabled = false;
		el.style.backgroundColor = "";
		el.style.cursor = "auto";
	});
	fieldsetRef.querySelectorAll(".remove-payee-btn").forEach((btn) => {
		btn.disabled = false;
		btn.style.display = "inline-block";
	});
	const addBtn = fieldsetRef.querySelector(".payee-container > div > button");
	if (addBtn) {
		addBtn.disabled = false;
		addBtn.style.display = "inline-block";
	}
}

// ============================
// Program Cards Handling
// ============================
function clearProgramCards() {
	pForm.programsFieldset.ref.innerHTML = "";
}

function createProgramCards(selectedDivision) {
	const parent = pForm.programsFieldset.ref;

	if (!selectedDivision) {
		clearProgramCards();
		contactEditBtn.style.display = "none";
		return;
	}

	clearProgramCards();

	contactEditBtn.style.display = "inline-block";

	selectedDivision.programList.forEach((pro) => {
		const fieldsetRef = document.createElement("fieldset");
		fieldsetRef.id = `${pro.programName.toLowerCase()}-program`;
		fieldsetRef.classList.add("program");

		const programTitleRef = document.createElement("p");
		programTitleRef.classList.add("p-title");
		programTitleRef.textContent = pro.programName;
		fieldsetRef.appendChild(programTitleRef);

		// Payee Section
		const payeeSection = document.createElement("section");
		payeeSection.classList.add("payee-container", "program-sections");

		const addPayeeDiv = document.createElement("div");
		const addPayeeBtn = document.createElement("button");
		addPayeeBtn.type = "button";
		addPayeeBtn.textContent = "Add";
		addPayeeDiv.appendChild(addPayeeBtn);
		payeeSection.appendChild(addPayeeDiv);

		addPayeeBtn.addEventListener("click", () => {
			addPayee(payeeSection, pro.programName, addPayeeDiv);
		});

		for (const [payeeName, payeeAmount] of Object.entries(pro.payees)) {
			addPayee(
				payeeSection,
				pro.programName,
				addPayeeDiv,
				payeeName,
				payeeAmount
			);
		}

		fieldsetRef.appendChild(payeeSection);

		// Paid / Submitted Section
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
		paidDiv.append(paidLabel, paidInput);

		const submittedDiv = document.createElement("div");
		const submittedLabel = document.createElement("label");
		submittedLabel.htmlFor = `${pro.programName.toLowerCase()}-submitted`;
		submittedLabel.textContent = "Submitted";
		const submittedInput = document.createElement("input");
		submittedInput.type = "checkbox";
		submittedInput.id = `${pro.programName.toLowerCase()}-submitted`;
		submittedInput.checked = pro.reportSubmitted;
		submittedDiv.append(submittedLabel, submittedInput);

		moneyFieldset.append(paidDiv, document.createElement("hr"), submittedDiv);
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

		notesFieldset.append(notesLabel, notesTextarea);
		fieldsetRef.appendChild(notesFieldset);

		// Action Buttons
		const btnContainer = document.createElement("div");
		btnContainer.classList.add("program-buttons");

		const editBtn = document.createElement("button");
		editBtn.type = "button";
		editBtn.textContent = "Edit";

		const saveBtn = document.createElement("button");
		saveBtn.type = "button";
		saveBtn.textContent = "Save Program";

		const cancelBtn = document.createElement("button");
		cancelBtn.type = "button";
		cancelBtn.textContent = "Cancel";

		btnContainer.append(editBtn, saveBtn, cancelBtn);
		fieldsetRef.appendChild(btnContainer);

		parent.appendChild(fieldsetRef);

		// Grey out initially
		greyOutProgramCard(fieldsetRef);
		saveBtn.style.display = "none";
		cancelBtn.style.display = "none";

		// --------------------------
		// Edit Click
		// --------------------------
		editBtn.addEventListener("click", () => {
			const originalState = {
				notes: notesTextarea.value,
				payees: Object.fromEntries(
					[...payeeSection.querySelectorAll(".payee-item")].map((item) => {
						const nameInput = item.querySelector("input[type=text]");
						const moneyInput = item.querySelector("input[type=number]");
						return [nameInput.value, moneyInput.value];
					})
				),
				hasBeenPaid: paidInput.checked,
				reportSubmitted: submittedInput.checked,
			};

			enableProgramCard(fieldsetRef);

			editBtn.style.display = "none";
			saveBtn.style.display = "inline-block";
			cancelBtn.style.display = "inline-block";

			// Cancel
			cancelBtn.onclick = () => {
				notesTextarea.value = originalState.notes;
				payeeSection
					.querySelectorAll(".payee-item")
					.forEach((el) => el.remove());
				for (const [name, amount] of Object.entries(originalState.payees)) {
					addPayee(payeeSection, pro.programName, addPayeeDiv, name, amount);
				}
				paidInput.checked = originalState.hasBeenPaid;
				submittedInput.checked = originalState.reportSubmitted;

				greyOutProgramCard(fieldsetRef);

				editBtn.style.display = "inline-block";
				saveBtn.style.display = "none";
				cancelBtn.style.display = "none";
			};

			// Save
			saveBtn.onclick = () => {
				pro.notes = notesTextarea.value;
				pro.payees = {};
				payeeSection.querySelectorAll(".payee-item").forEach((item) => {
					const nameInput = item.querySelector("input[type=text]");
					const moneyInput = item.querySelector("input[type=number]");
					pro.payees[nameInput.value] = moneyInput.value;
				});
				pro.hasBeenPaid = paidInput.checked;
				pro.reportSubmitted = submittedInput.checked;

				greyOutProgramCard(fieldsetRef);

				editBtn.style.display = "inline-block";
				saveBtn.style.display = "none";
				cancelBtn.style.display = "none";
			};
		});
	});
}

// ============================
// Payee Helpers
// ============================
function addPayee(
	payeeSection,
	programName,
	addBtnDiv,
	name = "",
	amount = ""
) {
	const payeeItems = payeeSection.querySelectorAll(".payee-item");
	const newPayeeNumber = payeeItems.length + 1;

	const payeeDiv = document.createElement("div");
	payeeDiv.classList.add("payee-item");
	payeeDiv.dataset.payeeNumber = newPayeeNumber;

	const label = document.createElement("label");
	label.htmlFor = `${programName.toLowerCase()}-payee-${newPayeeNumber}`;
	label.textContent = `Payee #${newPayeeNumber}`;

	const inputSection = document.createElement("div");
	inputSection.classList.add("program-payee-input-section");

	const nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.id = `${programName.toLowerCase()}-payee-${newPayeeNumber}`;
	nameInput.value = name;

	const moneyInput = document.createElement("input");
	moneyInput.type = "number";
	moneyInput.id = `${programName.toLowerCase()}-payee-${newPayeeNumber}-money`;
	moneyInput.value = amount;

	const removeBtn = document.createElement("button");
	removeBtn.type = "button";
	removeBtn.classList.add("remove-payee-btn");
	removeBtn.textContent = "Remove";

	removeBtn.addEventListener("click", () => {
		payeeDiv.remove();
		updatePayeeNumbers(payeeSection, programName);
	});

	inputSection.append(nameInput, moneyInput, removeBtn);
	payeeDiv.append(label, inputSection);

	payeeSection.insertBefore(payeeDiv, addBtnDiv);
}

function updatePayeeNumbers(payeeSection, programName) {
	const payeeItems = payeeSection.querySelectorAll(".payee-item");
	payeeItems.forEach((payeeDiv, index) => {
		const number = index + 1;
		payeeDiv.dataset.payeeNumber = number;

		const label = payeeDiv.querySelector("label");
		label.htmlFor = `${programName.toLowerCase()}-payee-${number}`;
		label.textContent = `Payee #${number}`;

		const nameInput = payeeDiv.querySelector("input[type=text]");
		nameInput.id = `${programName.toLowerCase()}-payee-${number}`;

		const moneyInput = payeeDiv.querySelector("input[type=number]");
		moneyInput.id = `${programName.toLowerCase()}-payee-${number}-money`;
	});
}

// ============================
// Contact Info Handling
// ============================
contactEditBtn.addEventListener("click", () => {
	const originalState = {
		dean: pForm.selectFieldset.deanRef.value,
		pen: pForm.selectFieldset.penRef.value,
		loc: pForm.selectFieldset.locRef.value,
		chair: pForm.selectFieldset.chairRef.value,
	};

	contactFields.forEach((el) => {
		el.disabled = false;
		el.style.backgroundColor = "";
		el.style.cursor = "auto";
	});

	contactEditBtn.style.display = "none";
	contactSaveBtn.style.display = "inline-block";
	contactCancelBtn.style.display = "inline-block";

	// Cancel click
	contactCancelBtn.onclick = () => {
		pForm.selectFieldset.deanRef.value = originalState.dean;
		pForm.selectFieldset.penRef.value = originalState.pen;
		pForm.selectFieldset.locRef.value = originalState.loc;
		pForm.selectFieldset.chairRef.value = originalState.chair;

		greyOutContactInfo();
	};

	// Save click
	contactSaveBtn.onclick = () => {
		if (selectedDivision) {
			selectedDivision.deanName = pForm.selectFieldset.deanRef.value;
			selectedDivision.penContact = pForm.selectFieldset.penRef.value;
			selectedDivision.locRep = pForm.selectFieldset.locRef.value;
			selectedDivision.chairName = pForm.selectFieldset.chairRef.value;
		}
		greyOutContactInfo();
	};
});

// ============================
// Contact Info Update
// ============================
function toggleEnabled(toggle, elements) {
	elements.forEach((el) => {
		el.disabled = !toggle;
		el.style.backgroundColor = toggle ? "" : "#eee";
		el.style.cursor = toggle ? "auto" : "not-allowed";
	});
}

function updateContactInfo(depName) {
	const fields = pForm.selectFieldset;

	if (!depName) {
		fields.deanRef.value = "";
		fields.penRef.value = "";
		fields.locRef.value = "";
		fields.chairRef.value = "";

		toggleEnabled(false, contactFields);
		return;
	}

	const dept = data.departments.find((d) => d.divisionName === depName);
	selectedDivision = dept;
	if (!dept) return;

	fields.deanRef.value = dept.deanName;
	fields.penRef.value = dept.penContact;
	fields.locRef.value = dept.locRep;
	fields.chairRef.value = dept.chairName;

	enableContactEditBtn();
	toggleEnabled(false, contactFields);
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
greyOutContactInfo();

pForm.selectFieldset.divisionSelector.addEventListener("change", function () {
	updateContactInfo(this.value);
	updateProgramCards(this.value);
});
