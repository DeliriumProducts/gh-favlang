import 'babel-polyfill';

let oldUser = "";
let primaryColor;
let secondaryColor;
let languages = [];

$(document).ready(() => {
    // HIDING PROFILE DIV   
    $('#profile').hide();
    $('#main').hide();
    $('#main').slideDown(500);
    // EVENTS
    $('#user').keypress(function(event) {
        if (event.keyCode == 13) {
            $('#search').trigger('click');
        }
    });

    $('#search').click(() => {
        const user = $('#user').val();

        if (user !== oldUser) {
            $('#profile').slideUp(250, 'swing', async () => {

                // RESET THE DOM ELEMENTS AND VARIABLES EVERYTIME 
                $('#username').text(``);
                $('#fav-lang').html(``);
                $('#avatar').attr('src', ``);

                languages = [];
                primaryColor = '#425568';
                secondaryColor = '#334251';

                getUserTopLang(user);
            });
        }
    })
});

const updateDOM = (avatarSrc, profileLink, userText, favLangHtml) => {
    $('#avatar').attr('src', avatarSrc).on('load', () => {
        $('#avatar-link').attr('href', profileLink);
        $('#username').text(userText);
        $('#fav-lang').html(favLangHtml);
        animations();
    });
};

const animations = () => {
    // PRIMARY
    anime({
        targets: ".lang-color-primary",
        fill: primaryColor,
        color: primaryColor,
        easing: 'easeOutQuart'
    });
    anime({
        targets: "body",
        backgroundColor: primaryColor,
        easing: 'easeOutQuart'
    });

    // SECONDARY
    anime({
        targets: ".btn",
        backgroundColor: secondaryColor,
        boxShadow: '0 0 10px ' + secondaryColor,
        easing: 'easeOutQuart'
    });
    anime({
        targets: ".lang-color-secondary",
        fill: secondaryColor,
        color: secondaryColor,
        easing: 'easeOutQuart'
    });

    // DIV SLIDE DOWN
    $('#profile').slideDown(250);
};

// CONVERTS SVGS WHICH ARE IN IMG TAGS TO NORMAL SVGS
$(function () {
    $('img.svg').each(function () {
        let $img = $(this);
        let imgID = $img.attr('id');
        let imgClass = $img.attr('class');
        let imgURL = $img.attr('src');
        $.get(imgURL, function (data) {
            let $svg = $(data).find('svg');
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }
            $svg = $svg.removeAttr('xmlns:a');
            $img.replaceWith($svg);
        }, 'xml');
    });
})

const getUserTopLang = async (user) => {

    const { userData, reposData, error } = await requestData(user);

    // HANDLE ERROR IF THERE IS ANY
    if (typeof error == 'number') {
        handleError(error);
        oldUser = user;
        return;
    }

    // GETTING ALL USED LANGUAGES AMONG THE REPOS
    for (const repo of reposData) {
        if ($('#enable-forks').is(':checked') || repo.fork == false) {
            let language = repo.language;
            if (language === null) {
                continue;
            }
            let index = languages.findKey(language);
            if (index != undefined) {
                languages[index][language]++;
            } else {
                languages.push({ [language]: 1 });
            }
        }
    }

    // SORTING THE LANGUAGE ARRAY BY DESCENDING ORDER
    languages = languages.sort((a, b) => {
        let first = Object.values(a);
        let second = Object.values(b);
        return second - first;
    });

    // FIRST ELEMENT IS THE MOST USED LANGUAGE
    let topLangugage;
    if (languages.length > 0) {
        topLangugage = Object.keys(languages[0]);
    } else {
        handleError(404);
        oldUser = user;
        return;
    }

    const { githubColors } = await import('./colors.js');
    // UPDATE DOM WITH THE APPROPRIATE DATA
    if (githubColors[topLangugage].color != undefined || githubColors[topLangugage.color != null]) {
        primaryColor = githubColors[topLangugage].color;
        secondaryColor = chroma(primaryColor).darken(0.25).hex();
    }

    const avatarUrl = userData.avatar_url;
    const profileUrl = `https://github.com/${user}`;
    const name = userData.name ? userData.name : userData.login; // if available, display the user's real name, rather than the username
    const favLang = `<a href="https://github.com/${user}">${user}</a>'s favorite coding language is: <span id="language-span">${topLangugage}</span>`;

    updateDOM(avatarUrl, profileUrl, name, favLang);
    oldUser = user;
}

const requestData = (user) => {
    const userPromise = axios.get(`https://api.github.com/users/${user}`);
    const reposPromise = axios.get(`https://api.github.com/users/${user}/repos?type=all`);

    return Promise.all([userPromise, reposPromise])
        .then((data) => ({
            userData: data[0].data,
            reposData: data[1].data,
        }))
        .catch((err) => ({
            error: err.response.status
        }));
};

const handleError = (error) => {
    updateDOM(
        `https://http.cat/${error}.jpg`,
        `https://http.cat/${error}`,
        `Oops! Error code ${error}`,
        `Maybe try again? :c`
    );
}

Array.prototype.findKey = function (key) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].hasOwnProperty(key)) {
            return i;
        }
    }
    return undefined;
};




