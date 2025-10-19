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
		import(intoWebstormLink('modules/toolkit.mjs')).then((toolkit) => {
			toolkit.addStyle("components/sparklebox/sparklebox");
		});

		this.className = "sparkle-box";

		this.form_circles(this.count);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "count") {
			this.form_circles(Number(newValue));
		}
	}
}

customElements.define("sn-sparklebox", SparkleBox);