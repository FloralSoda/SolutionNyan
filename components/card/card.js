class Card extends HTMLElement {
	static observedAttributes = ["datetime", "title", "tags", "preview", "href"]
	#datetitle_element;
	#date_element;
	#title_element;
	#tags_element;
	#preview_element;
	#href_element;


	get datetime() {
		return this.getAttribute("datetime");
	}

	set datetime(value) {
		this.setAttribute("datetime", value);
	}

	get title() {
		return this.getAttribute("title");
	}

	set title(value) {
		this.setAttribute("title", value);
	}

	get tags() {
		return this.getAttribute("tags");
	}

	set tags(value) {
		this.setAttribute("tags", value);
	}

	get preview() {
		return this.getAttribute("preview");
	}

	set preview(value) {
		this.setAttribute("preview", value);
	}

	get href() {
		return this.getAttribute("href");
	}

	set href(value) {
		this.setAttribute("href", value);
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.classList.add("selectorcard");

		this.add_time_and_header();
		this.add_tags();
		this.add_preview();
		this.add_link();

		import(intoWebstormLink('modules/toolkit.mjs')).then((toolkit) => {
			toolkit.addStyle("components/card/card");
		});
	}

	into_date(date) {
		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		const suffix = ["th", "st", "nd", "rd"];

		const dateNum = date.getDate();
		let suffix_digit;
		if (dateNum >= 11 && dateNum <= 13) {
			suffix_digit = 0;
		} else {
			suffix_digit = Number(dateNum.toString().slice(-1));

			if (suffix_digit > 3) {
				suffix_digit = 0;
			}
		}
		return `${date.getDate()}${suffix[suffix_digit]} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
	}

	add_time_and_header() {
		if (this.#datetitle_element !== undefined) {
			this.removeChild(this.#datetitle_element);
		}
		const date_title = document.createElement("div");
		date_title.style.maxWidth = "290px";
		date_title.style.gridArea = "timeheader";

		const time = document.createElement("time");
		if (this.datetime != null) {
			time.datetime = this.datetime;
			const date = new Date(this.datetime);
			time.title = `Originally published on ${date.toLocaleDateString()}`;
			time.innerText = this.into_date(date);
		} else {
			time.innerText = "a";
			time.style.color = "transparent";
		}
		this.#date_element = time;
		date_title.appendChild(time);

		const header = document.createElement("h3");
		header.innerText = this.title;
		date_title.appendChild(header);
		this.#title_element = header;

		this.appendChild(date_title);
		this.#datetitle_element = date_title;
	}

	add_tags() {
		if (this.tags === null) {
			if (this.#tags_element !== undefined) {
				this.removeChild(this.#tags_element);
				this.#tags_element = undefined;
			}
			return;
		}
		if (this.#tags_element !== undefined) {
			this.removeChild(this.#tags_element);
		}
		const taglist = document.createElement("div");
		taglist.classList.add("tags");

		const tags = this.tags.split(";");
		tags.forEach(tag => {
			const a = document.createElement("a");
			a.innerText = tag;
			taglist.appendChild(a);
		});

		this.appendChild(taglist);
		this.#tags_element = taglist;
	}

	add_preview() {
		if (this.#preview_element !== undefined) {
			this.removeChild(this.#preview_element);
		}

		const preview = document.createElement("p");
		preview.innerText = this.preview;
		this.appendChild(preview);
		this.#preview_element = preview;
	}

	add_link() {
		if (this.#href_element !== undefined) {
			this.removeChild(this.#href_element);
		}

		const link = document.createElement("a");
		link.href = this.href;
		link.style.gridArea = "timeheader-start / timeheader-start / preview-end / preview-end";

		this.appendChild(link);

		this.#href_element = link;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "datetime" || name === "title") {
			this.add_time_and_header();
		} else if (name === "tags") {
			this.add_tags();
		} else if (name === "preview") {
			this.add_preview();
		} else if (name === "href") {
			this.add_link();
		}
	}
}

customElements.define('sn-card', Card);