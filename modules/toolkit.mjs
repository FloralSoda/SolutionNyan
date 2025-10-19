/*
This file contains useful global functions that I like to make use of.
*/

export function addStyle(style) {
	const link = intoWebstormLink(style + ".css");
	for (let child of document.head.getElementsByTagName("link")) {
		if (child.href && child.href.endsWith(style + ".css")) {
			return;
		}
	}
	const theme_ele = document.createElement("link");
	theme_ele.rel = "stylesheet";
	theme_ele.type="text/css";
	theme_ele.media= "all";

	theme_ele.href = link;

	document.head.appendChild(theme_ele);
}
