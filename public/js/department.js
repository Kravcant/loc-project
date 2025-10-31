export class Department {
	// Class constructor
	constructor(division, chair, dean, pen, locRep) {
		this.divisionName = division;
        this.chairName = chair;
		this.deanName = dean;
		this.penContact = pen;
		this.locRep = locRep;
	}

	// Class getters
	getDivName() {
		return this.divisionName;
	}

    getChairName() {
		return this.chairName;
	}

	getDeanName() {
		return this.deanName;
	}

	getPenContact() {
		return this.penContact;
	}

	getLocRep() {
		return this.locRep;
	}

	// Class setters
	setDivName(division) {
		this.divisionName = division;
	}

    setChairName(chair) {
		this.chairName = chair;
	}

	setDeanName(dean) {
		this.deanName = dean;
	}

	setPenContact(pen) {
		this.penContact = pen;
	}

	setLocRep(locRep) {
		this.locRep = locRep;
	}
}
