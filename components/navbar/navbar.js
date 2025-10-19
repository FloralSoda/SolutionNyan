const page_names = {
	home: "Home",
	about: "About",
	work: "My Work",
	apps: "Utilities",
	games: "Games",
	articles: "Blog",
}

// Defines a specific button
class NavButton {
	static id;
	static children;

	constructor(id, children) {
		this.id = id;
		this.children = children;
	}

	render(current) {
		if (typeof this.children === "string") {
			if (this.id === current) {
				return `<a class="navbar-link active"><span>${page_names[this.id]}</span></a>`
			} else {
				return `<a class="navbar-link" href="${intoWebstormLink(this.children)}"><span>${page_names[this.id]}</span></a>`;
			}
		} else if (Array.isArray(this.children)) {
			let out = [`<div class="navbar-dropdown"><button class="navbar-link navbar-dropdown">${page_names[this.id]}</button><div class="navbar-content">`];

			this.children.forEach(child => {
				if (!child instanceof NavButton) {
					console.error(`Child of ${this.id} was not a NavButton. Skipping`);
				} else {
					out.push(child.render(current))
				}
			});

			out[out.length - 1].replace('class="', "class=\"end")

			out.push("</div></div>")
			return out.join("");
		}
	}
}


//The pages of the website
const pages = [
	new NavButton("home", "/pages/index.html"),
	new NavButton("work", [new NavButton("apps", "/pages/apps.html"), new NavButton("games", "/pages/games.html"), new NavButton("articles", "/pages/articles.html")],),
	new NavButton("about", "/pages/about.html"),
]

//The navbar itself
export class Navbar extends HTMLElement {
	static observedAttributes = ["current"]

	get currentPage() {
		return this.getAttribute("current");
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.id = "navbar-area";

		const current = this.currentPage;

		let out = ["<div id='navbar'>"];

		pages.forEach(page => {
			out.push(page.render(current));
		});

		out.push("</div>");

		this.innerHTML = out.join("");

		import(intoWebstormLink('modules/toolkit.mjs')).then((toolkit) => {
			toolkit.addStyle("components/navbar/navbar");
		});
	}
}

customElements.define("sn-navbar", Navbar);