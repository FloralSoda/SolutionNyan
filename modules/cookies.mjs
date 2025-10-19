/*
Here is where we do all cookie management. Everywhere else that cookies are accessed pass directly through here.

Cookies are used for nothing except cosmetics at this time. Feel free to look through the code to confirm this.

That being said, all this functionality is off by default and will use default values unless cookies are allowed after
actively interacting with something that sets cookies.
*/

/*
If null, the user hasn't decided yet. Otherwise boolean.
*/
export async function allowsCookies() {
	return await getCookie('can_cookies');
}

/*
Returns true if cookies are allowed, otherwise
 */
export async function requestCookieAccess() {
	let allow = await allowsCookies();
    if (allow) {
        console.error("Cookie requester NYI. Allowing for development purposes");
        return true;
    } else {
        return allow;
    }
}

function supportsCookieStore() {
	return 'cookieStore' in window;
}

// Gets the cookie by this name. Will use CookieStoreAPI if available
export async function getCookie(name) {
	if (supportsCookieStore()) {
		try {
			const cookie = await cookieStore.get(name);
			if (cookie) {
				return cookie.value;
			} else {
				return null;
			}
		} catch (err) {
			console.error("Failed to retrieve cookie", err);
		}
	} else {
		return document.cookie.split(';').some(c => {
			return c.trim().startsWith(decodeURIComponent(name) + "=");
		})
	}
}
// Sets the cookie by this name with this value. Will use CookieStoreAPI if available
export async function setCookie(name, value) {
	if (supportsCookieStore()) {
		try {
			await cookieStore.set({ id: name, value: value });
		} catch (err) {
			console.error("Failed to retrieve cookie", err);
		}
	} else {
		document.cookie = decodeURIComponent(name) + "=" + value + ";path=/;";
	}
}

// Deletes the cookie by this name. Will use CookieStoreAPI if available
export async function deleteCookie(name) {
	if (supportsCookieStore()) {
		try {
			await cookieStore.delete(name);
		} catch (err) {
			console.error("Failed to retrieve cookie", err);
		}
	} else {
		document.cookie = decodeURIComponent(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}
}

export const default_theme = "sollune";
/*
Gets the user's selected theme
*/
export async function getTheme() {
	if (!!await allowsCookies()) {
		const cookie = await getCookie("theme");
		if (cookie) {
			return cookie;
		}
	}
	return default_theme;
}