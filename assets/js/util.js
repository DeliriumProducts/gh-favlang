import "babel-polyfill";
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

    // UPDATE DOM WITH THE APPROPRIATE DATA
    if (colors[topLangugage].color != undefined || colors[topLangugage.color != null]) {
        primaryColor = colors[topLangugage].color;
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

