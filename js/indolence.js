/**
 * Copyright (c) 2023 hidao80
 * Released under the MIT license
 * https://opensource.org/licenses/mit-license.php
*/
/**
 * Returns a new element with the given tag name.
 * @param {string} tagName
 * @returns {HTMLElement}
 */
export const $$new = (tagName) => document.createElement(tagName);

/**
 * Suppress debug printing.
 */
export const $$disableConsole = () => {
    ["log", "debug", "warn", "info", "error", "table"].forEach(v => {
        window.console[v] = () => {};
    });
};

/**
 * Returns a element with the given selector name.
 * @param {string} selector
 * @returns {HTMLElement}
 */
export const $$one = (selector) => document.querySelector(selector);

/**
 * Returns elements with the given selector name.
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
export const $$all = (selector) => document.querySelectorAll(selector);

/**
 * Returns a calendar that goes back the specified number of days
 * from the specified last day or today as an array of strings.
 * @param {string|null} lastDate Last day of this calendar. e.g.) "YYYY/MM/DD". If null, today is used.
 * @returns {string[]} Array of strings representing the calendar for one month
 */
export const getDaysArray = (lastDate = null, days = 28) => {
    const date = lastDate ? new Date(lastDate) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();
    const daysArray = [];
    for (let offset = 0; offset < days; offset++) {
        const day = new Date(year, month, today - offset);
        const YYYY_MM_DD = year + "/" + ("0" + (day.getMonth() + 1)).slice(-2) + "/" + ("0" + day.getDate()).slice(-2);
        daysArray.push(YYYY_MM_DD);
    }

    // Reverse the array to display the calendar in ascending order.
    return  daysArray.reverse();
}
