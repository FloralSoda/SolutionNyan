//This folder includes a bunch of functions for dynamically producing components client side.
//This exists only because NeoCities is entirely static webpages. If I move to my own hosting, I'll move this
//to the server side.
;

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
				if (window.location.pathname.includes(cur[0]) || (cur[0] === "index" && !window.location.pathname.endsWith("html"))) {
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
		this.style.height = "100%";

		console.log("a")
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
		if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
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

customElements.define('sn-navbar', NavBar);
customElements.define('sn-sparklebox', SparkleBox);
customElements.define('sn-template', Template);

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