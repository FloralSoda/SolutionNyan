//This folder includes a bunch of functions for dynamically producing components client side.
//This exists only because NeoCities is entirely static webpages. If I move to my own hosting, I'll move this
//to the server side.
;
let isIndexPage = false;

///The navbar at the top of the page
class NavBar extends HTMLElement {

	constructor() {
		super();
	}

	///Code to execute when the component is added to the page
	connectedCallback() {
		//List of pages and their names
		const pages = [
			["index", "Home", "./index.html"],
			["games", "Game Dev", "./games.html"],
			["apps", "App Dev", "./apps.html"],
			["about", "About Me", "./about.html"],
		]

		function generate_buttons(pages) {
			return pages.reduce((acc, cur) => {
				if (window.location.pathname.includes(cur[0]) || (cur[0] === "index" && isIndexPage)) {
					//This one is the active address. Don't redirect when clicking.
					return acc + `<a class="active"><span>${cur[1]}</span></a>`
				} else {
					//This one is not the active address. Redirect when clicking.
					return acc + `<a href="${cur[2]}"><span>${cur[1]}</span></a>`
				}
			}, "")
		}

		this.id = "navbar-area";
		this.innerHTML += `<div id='navbar'>${generate_buttons(pages)}</div>`;
	}
}

///Generates sparkles behind everything
class SparkleBox extends HTMLElement {
	static observedAttributes = ["count"]

	get count() {
		return this.getAttribute("count");
	}

	set count(value) {
		this.setAttribute("count", value);
	}

	constructor() {
		super();
	}

	form_circles(count) {
		const circle = "<div class='circle-container'> <div class='circle'></div> </div>"

		//Generate `count` circles, and insert them into this box. THe rest of the animation is done via css.
		this.innerHTML = circle.repeat(count);
	}

	connectedCallback() {
		this.className = "sparkle-box";
		this.style.position = "absolute";
		this.style.bottom = "0";

		this.form_circles(this.count);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "count") {
			this.form_circles(Number(newValue));
		}
	}
}

///Generates the page template using premade components. Requires `./default.css` to look right.
class Template extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.generate_decorations();
		this.generate_wipbanner();
		this.className = "container";
	}

	generate_decorations() {
		let navbar = document.createElement("sn-navbar");
		let sparkles = document.createElement("sn-sparklebox");
		sparkles.id = "sparkles"
		sparkles.count = "100";
		this.insertAdjacentElement("beforebegin", navbar);
		this.insertAdjacentElement("beforebegin", sparkles);
	}

	generate_wipbanner() {
		if (location.protocol !== "file:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
			this.insertAdjacentHTML("afterend", `<div id="wipbanner" style="position: absolute; top: 50%; left:0; align-self: center; height: 20px; width: 100%; grid-column: 1/4; background: repeating-linear-gradient(
	            45deg,
	            #0008,
	            #0008 10px,
	            #FF68 10px,
	            #FF68 20px
			);">
				Work in progress
			</div>`)
		}
	}
}

class Card extends HTMLElement {
	static observedAttributes = ["datetime", "title", "tags", "preview"]
	#datetitle_element;
	#date_element;
	#title_element;
	#tags_element;
	#preview_element;


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

	constructor() {
		super();
	}

	connectedCallback() {
		this.classList.add("selectorcard");

		this.add_time_and_header();
		this.add_tags();
		this.add_tags();
	}

	into_date(date) {
		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		const suffix = ["th", "st", "nd", "rd"];

		let suffix_digit = Number(date.getDate().toString().slice(-1));
		if (suffix_digit > 0) {
			suffix_digit = 0;
		}
		return `${date.getDate()}${suffix[suffix_digit]} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
	}

	add_time_and_header() {
		if (this.#datetitle_element !== undefined) {
			this.removeChild(this.#datetitle_element);
		}
		const date_title = document.createElement("div");
		date_title.style.maxWidth = "290px";

		const time = document.createElement("time");
		time.datetime = this.datetime;
		const date = new Date(this.datetime);
		time.title = `Originally published on ${date.toLocaleDateString()}`;
		time.innerText = this.into_date(date);
		date_title.appendChild(time);
		this.#date_element = time;

		const header = document.createElement("h3");
		header.innerText = this.title;
		date_title.appendChild(header);
		this.#title_element = header;

		this.appendChild(date_title);
		this.#datetitle_element = date_title;
	}

	add_tags() {
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

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "datetime" || name === "title") {
			this.add_time_and_header();
		} else if (name === "tags") {
			this.add_tags();
		} else if (name === "preview") {
			this.add_preview();
		}
	}
}

customElements.define('sn-navbar', NavBar);
customElements.define('sn-sparklebox', SparkleBox);
customElements.define('sn-template', Template);
customElements.define('sn-card', Card);

console.log("Components successfully loaded!");

window.onload = () => {
	const jswarning = document.getElementById("jswarning");
	if (jswarning !== null) {
		jswarning.remove();
	} else {
		console.log("Failed to remove warning!");
	}

	if (customElements && customElements.define) {
		const elementerr = document.getElementById("element-error");
		if (elementerr !== null) {
			elementerr.remove();
		} else {
			console.log("Failed to remove element error warning!");
		}
	} else {
		console.log("Custom elements are not supported!")
	}
}
