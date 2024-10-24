import __ from "./multilingalization.js";
import { $$one, $$disableConsole } from "./indolence.js";

// disable console outputs.
$$disableConsole();

async function urlShorten() {
    let inputUrl = $$one("#input-url").value;
    // if (!inputUrl.includes("amazon.")) {
    //     inputUrl = await expandShortUrl(inputUrl);
    //     console.debug(inputUrl)
    // }
    const fields = inputUrl.replace(/\?.+$/, "").split("/");
    const productId = fields.filter(v => v.match(/^[A-Z0-9]+$/))[0];
    let shortUrl = "";
    // console.debug(fields);
    if (inputUrl.includes("r.html?")) {
        // for gift voucher url
        shortUrl = decodeURIComponent(inputUrl)
            .split("&")
            .filter((field) => field.match(/U=/) !== null)[0]
            .slice("U=".length, shortUrl.indexOf("?"));
    } else {
        // #TODO Localization will be done later.
        const domain = "amazon." + (inputUrl.includes("amazon.co.jp") ? "jp" : "com");
        shortUrl = `https://${domain}/d/${productId}`;
    }
    console.debug(shortUrl);
    const country =
        shortUrl.split("/")[2].split(".").slice(-1) == "jp" ? "5" : "1";
    const keepaUrl = "https://keepa.com/#!product/" + country + "-" + productId;
    const sakuraCheckerUrl = "https://sakura-checker.jp/search/" + productId;
    // console.debug(shortUrl, keepaUrl);

    // show short url message
    const msgSuccess = $$one("#shortener-success");
    const msgAlert = $$one("#shortener-danger");
    msgSuccess.classList.add("visually-hidden");
    msgAlert.classList.add("visually-hidden");

    if (shortUrl) {
        copyToClipboard(shortUrl, keepaUrl, sakuraCheckerUrl).then(
            (result) => (msgSuccess.innerHTML = result)
        );
        msgSuccess.classList.remove("visually-hidden");
    } else {
        msgAlert.classList.remove("visually-hidden");
    }
}

/**
 * Copy text to clipboard
 * @param {string} text Text to be copied
 * @param {string} keepaUrl Keepa URL
 * @param {string} sakuraCheckerUrl Sakura checker URL
 * @returns {Promise<string>} Result message
 */
async function copyToClipboard(text, keepaUrl, sakuraCheckerUrl) {
    try {
        await navigator.clipboard.writeText(text);
        return (
            __.translate("Copied the URL to the clipboard; ") +
            "<strong>" +
            text +
            "</strong><br>" +
            __.translate("Keepa URL; ") +
            '<a href="' +
            keepaUrl +
            '" target="_blank">' +
            keepaUrl +
            "</a><br>" +
            __.translate("Sakura checker URL; ") +
            '<a href="' +
            sakuraCheckerUrl +
            '" target="_blank">' +
            sakuraCheckerUrl +
            "</a>"
        );
    } catch (error) {
        return (
            __.translate("Could not copy the URL; ") +
            "<strong>" +
            text +
            "</strong>"
        );
    }
}

/**
 * Expands a shortened URL by sending a HEAD request to the provided short URL.
 *
 * @async
 * @function expandShortUrl
 * @param {string} shortUrl - The shortened URL to be expanded.
 * @returns {Promise<string>} A promise that resolves to the expanded URL.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
async function expandShortUrl(shortUrl) {
    try {
        const response = await fetch(shortUrl, {
            method: 'HEAD',
            redirect: 'follow',
        });
        console.log("Redirect destination URL: ", response.url);
        return response.url;
    } catch (error) {
        console.error('An error has occurred: ', error);
        return shortUrl;
    }
}

const instBtn = $$one("#install");

// Add a button to install the app.
addEventListener("beforeinstallprompt", (event) => {
    console.debug("beforeinstallprompt: ", event);
    event.preventDefault();
    instBtn.promptEvent = event;
});

addEventListener("DOMContentLoaded", () => {
    __.translateAll();

    $$one("#shortener-btn").addEventListener("click", urlShorten);

    $$one("#input-url").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            urlShorten();
        }
    });

    // Check if the PWA is already installed and add the install button.
    // if (!window.matchMedia("(display-mode: standalone)").matches) {
    //     const instDiv = $$one("#install-container");
    //     instDiv.classList.remove("d-none");
    //     instBtn.addEventListener("click", () => {
    //         if (instBtn.promptEvent) {
    //             instBtn.promptEvent.prompt(); // show dialog
    //             instBtn.promptEvent.userChoice.then((choiceResult) => {
    //                 console.debug("User choice: ", choiceResult);
    //                 instDiv.classList.add("d-none");
    //                 instBtn.promptEvent = null;
    //             });
    //         }
    //     });
    // }

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/amazon-url-shortener/sw.js");
    }
});
