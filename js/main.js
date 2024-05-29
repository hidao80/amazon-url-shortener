import __ from "./multilingalization.js";

function urlShorten() {
    const inputUrl = document.getElementById("input-url").value;
    const fields = inputUrl.split("/");
    let shortUrl = "";
    // console.debug(fields);
    if (inputUrl.includes("r.html?")) {
        // for gift voucher url
        shortUrl = decodeURIComponent(inputUrl)
            .split("&")
            .filter((field) => field.match(/U=/) !== null)[0]
            .slice("U=".length, shortUrl.indexOf("?"));
    } else {
        // If there is a query parameter, it is not a product ID.
        const productId = fields.slice(-1).pop();
        const withoutPrams = productId.replace(/\?.+$/, "");
        if (withoutPrams != productId) {
            fields.push(withoutPrams);
        }
        shortUrl = fields
            .filter((field) => field.match(/([%=-]|^$)/) === null)
            .join("/")
            // Delete query parameters
            .replace(/(\/[\d-]+|(hz|ls)\/|www\.)/g, "")
            .replace(/\.co\./g, ".") // Replace .co.jp with .jp
            .replace(/(\/gp\/product\/|\/dp\/)/, "/d/")
            // Add the beginning of the url
            .replace(/:\//, "://");
    }
    console.debug(shortUrl);
    const productId = shortUrl.split("/").slice(-1);
    const country =
        shortUrl.split("/")[2].split(".").slice(-1) == "jp" ? "5" : "1";
    const keepaUrl = "https://keepa.com/#!product/" + country + "-" + productId;
    const sakuraCheckerUrl = "https://sakura-checker.jp/search/" + productId;
    shortUrl = shortUrl.replace(/^https:\/\/(www\.)?/, "https://");
    // console.debug(shortUrl, keepaUrl);

    // show short url message
    const msgSuccess = document.getElementById("shortener-success");
    const msgAlert = document.getElementById("shortener-danger");
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

const $$one = (elem) => document.querySelector(elem);
const instBtn = $$one("#install");

window.addEventListener("beforeinstallprompt", (event) => {
    console.log("beforeinstallprompt: ", event);
    event.preventDefault();
    instBtn.promptEvent = event;
    instBtn.classList.remove("d-none"); // display element.
    return false;
});

window.addEventListener("DOMContentLoaded", () => {
    __.translateAll();

    $$one("#shortener-btn").addEventListener("click", urlShorten);
    $$one("#input-url").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            urlShorten();
        }
    });

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js");
    }

    instBtn.addEventListener("click", async () => {
        if (instBtn.promptEvent) {
            instBtn.promptEvent.prompt(); // show dialog
            await instBtn.promptEvent.userChoice;
            instBtn.classList.add("d-none");
            instBtn.promptEvent = null;
        }
    });
});
