import __ from './multilingalization.js';

function urlShorten() {
    const inputUrl = document.getElementById('input-url').value;
    const fields = inputUrl.split('/');
    let shortUrl = '';
    // console.log(fields);
    if (inputUrl.includes('r.html?')) {
        // for gift voucher url
        shortUrl = decodeURIComponent(inputUrl).split('&').filter(field => field.match(/U=/) !== null)[0]
        .slice('U='.length, shortUrl.indexOf('?'));
    } else {
        // If there is a query parameter, it is not a product ID.
        const productId = fields.slice(-1).pop();
        const withoutPrams = productId.replace(/\?.+$/, '');
        if(withoutPrams != productId) {
            fields.push(withoutPrams);
        }
        shortUrl = fields.filter(field => field.match(/([%=-]|^$)/) === null).join('/')
        // Delete query parameters
        .replace(/(\/[\d-]+|(hz|ls)\/|www\.)/g, "")
        .replace(/(\/gp\/product\/|\/dp\/)/, "/d/")
        // Add the beginning of the url
        .replace(/:\//, '://');
    }
    console.log(shortUrl);
    shortUrl = shortUrl.replace(/^https:\/\/(www\.)?/, 'https://').replace(/\.co\.jp/, ".jp");
    console.log(shortUrl);

    // show short url message
    const msgSuccess = document.getElementById('shortener-success');
    const msgAlert = document.getElementById('shortener-danger');
    msgSuccess.classList.add('visually-hidden');
    msgAlert.classList.add('visually-hidden');

    if (shortUrl) {
        copyToClipboard(shortUrl)
            .then(result => msgSuccess.innerHTML = result);
        msgSuccess.classList.remove('visually-hidden');
    } else {
        msgAlert.classList.remove('visually-hidden');
    }
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text)
        return __.translate('Copied the URL to the clipboard; ') + '<strong>' + text + '</strong>';
    } catch (error) {
        return __.translate('Could not copy the URL; ') + '<strong>' + text + '</strong>';
    }
}

window.onload = e => {
    __.translateAll();

    document.getElementById('shortener-btn').addEventListener('click', urlShorten);
    document.getElementById('input-url').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            urlShorten();
        }
        return false;
    });
}
