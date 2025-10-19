//Contains common components for pages

import(intoWebstormLink("components/navbar/navbar.js"));
import(intoWebstormLink("components/sparklebox/sparklebox.js"));
import(intoWebstormLink("components/card/card.js"));

window.onload = () => {
	const jswarning = document.getElementById("jswarning");
	if (jswarning !== null) {
		jswarning.remove();
	} else {
		console.warn("Failed to remove warning!");
	}

	if (customElements && customElements.define) {
		const elementerr = document.getElementById("element-error");
		if (elementerr !== null) {
			elementerr.remove();
		} else {
			console.warn("Failed to remove element error warning!");
		}
	} else {
		console.error("Custom elements are not supported!")
	}
}
