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

exports.updateDOM = (avatarSrc, profileLink, userText, favLangHtml) => {
    $('#avatar').attr('src', avatarSrc).on('load', () => {
        $('#avatar-link').attr('href', profileLink);
        $('#username').text(userText);
        $('#fav-lang').html(favLangHtml);
    });
}

exports.animations = (primaryColor, secondaryColor) => {
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
        borderColor: secondaryColor,
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
}

exports.requestData = (user) => {
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
}

exports.handleError = (error) => {
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
