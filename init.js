/*
This file exists to initialise this website's JS functionality from a single convenient file.
*/

// Webstorm refuses to serve my modules in the path I want it to :/ So this is a patch until I can be arsed
function intoWebstormLink(path) {
	if (window.location.hostname === "localhost") {
		return "/Solution Nyan 2/" + path;
	} else {
		return "/" + path;
	}
}

//Sets the icon of the page to the sn icon
function setIcon() {
	let icon_link = document.createElement('link');
	icon_link.setAttribute('rel', 'icon');
	icon_link.setAttribute('href', intoWebstormLink("assets/favicon.ico"));
	icon_link.setAttribute('type', 'image/x-icon');
	document.head.appendChild(icon_link);
}

//Gets the current theme and attaches it to this page
function setTheme() {
	import(intoWebstormLink('modules/cookies.mjs')).then((cookies) => {
		import(intoWebstormLink('modules/toolkit.mjs')).then((toolkit) => {
			cookies.getTheme().then(theme => {
				toolkit.addStyle("themes/" + theme);
			});
		});
	});
}

//Registers the basic components
function loadComponents() {
	import(intoWebstormLink('components/components.js')).then((components) => {
	});
	import(intoWebstormLink('modules/toolkit.mjs')).then((toolkit) => {
		console.log("loading default");
		toolkit.addStyle("pages/default");
	});
}

setIcon();
setTheme();
loadComponents();