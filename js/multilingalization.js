/*
 *  Licence: MIT
 *
 *  Copyright 2022 hidao80
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Multilingualization library class
 *
 * @class Multilingualization
 */
export default class Multilingualization {
    /**
     *  @var dictionaries Multilingual dictionary object
     */
    static dictionaries = {
        "en": {
            "Enter the Amazon URL you would like to shorten": "Enter the Amazon URL you would like to shorten:<ul><li>Product</li><li>Wishlist</li><li>Gift Voucher</li></ul>",
            "Shorten and copy": `Shorten and copy&nbsp;<i class="fas fa-copy"></i>`,
            "Copied the URL to the clipboard; ": "Copied the URL to the clipboard; ",
            "Could not copy the URL; ": "Could not copy the URL; ",
            "URL is invalid": "URL is invalid.",
            "Keepa URL; ": "Keepa URL; ",
            "Sakura checker URL; ": "Sakura checcker URL; ",
        },
        "ja": {
            "Enter the Amazon URL you would like to shorten": "短縮したいAmazonのURLを入力してください：<ul><li>商品</li><li>ほしいものリスト</li><li>ギフト券</li></ul>",
            "Shorten and copy": `短縮してコピー&nbsp;<i class="fas fa-copy"></i>`,
            "Copied the URL to the clipboard; ": "URLをクリップボードにコピーしました： ",
            "Could not copy the URL; ": "URLをコピーできませんでした：",
            "URL is invalid": "URLが正しくありません。",
            "Keepa URL; ": "KeepaのURL：",
            "Sakura checker URL; ": "サクラチェッカーのURL：",
        }
    }

    /**
     * Get current language
     *
     * @returns {string} Current language
     */
    static language() {
        const lang = ((window.navigator.languages && window.navigator.languages[0]) ||
            window.navigator.language ||
            window.navigator.userLanguage ||
            window.navigator.browserLanguage).slice(0, 2);

        // Show English for undefined languages
        return this.dictionaries[lang] ? lang : "en";
    }

    /**
     * Get translated term
     *
     * @param {string} term Term to be translated
     * @returns {string} Translated term
     */
    static translate(term) {
        return this.dictionaries[this.language()][term];
    }

    /**
     * Initialization of dictionary object
     */
    static translateAll() {
        const dictionary = this.dictionaries[this.language()];
        for (let elem of document.querySelectorAll('[data-translate]')) {
            elem.innerHTML = dictionary[elem.dataset.translate];
        }
    }
}
