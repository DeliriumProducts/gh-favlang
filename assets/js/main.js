const colors = window.githubColors;

let oldUser = "";
let primaryColor;
let secondaryColor;
let languages = [];

$(document).ready(() => {

    // INSTANCES OF DOM ELEMENTS
    const profileDiv = $('#profile');
    const avatarA = $('#avatar-link');
    const avatarImg = $('#avatar');
    const userInput = $('#user');
    const userP = $('#username');
    const favLangP = $('#fav-lang');

    // HIDING PROFILE DIV   
    profileDiv.hide();

    // EVENTS
    $('#search').click(() => {
        const user = userInput.val();
        if (user !== oldUser) {
            profileDiv.slideUp(250, 'swing', async () => {
                // CLEAR THE ARRAY EVERYTIME
                languages = [];

                primaryColor = '#425568';
                secondaryColor = '#334251';

                const { userData, topLangugage, status } = await getUserTopLang(user);

                // IF THERE IS A STATUS CODE DIFFERENT THAN 200, IT'S AN ERROR
                if (status != 200) {
                    let errorCode = status;
                    userP.text(`Error code ${errorCode}`);
                    favLangP.html(`Try again :c`);
                    avatarImg.attr('src', `https://http.cat/${errorCode}.jpg`);
                    animations(profileDiv, '#F46C6C', '#DE6060');
                    oldUser = user;
                    return;
                }

                const avatarUrl = userData.avatar_url;
                avatarImg.attr('src', avatarUrl);

                if (colors[topLangugage].color != undefined || colors[topLangugage.color != null]) {
                    primaryColor = colors[topLangugage].color;
                    secondaryColor = chroma(primaryColor).darken(0.25).hex();
                }

                let name = userData.name ? userData.name : userData.login; // if available, display the user's real name, rather than the username
                userP.text(name);
                avatarA.attr('href', `https://github.com/${user}`);
                favLangP.html(`<a href="https://github.com/${user}">${user}</a>'s favorite coding language is: <span id="language-span">${topLangugage}</span>`);
                animations(profileDiv);
                oldUser = user;
            });
        }
    })
});


const animations = (profileDiv) => {
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
    profileDiv.slideDown(250);
};

const getUserTopLang = async (user) => {

    // REQUEST THE INFO FOR THE GIVEN USER
    const userData = await requestUser(user);

    // REQUEST THE REPOS FOR THE GIVEN USER
    const reposData = await requestRepos(user);
    // RETURN ERROR CODE IF THERE IS AN ERROR
    if (!isNaN(userData)) {
        return { status: userData };
    } else if (!isNaN(reposData)) {
        return { status: reposData };
    }

    // GETTING ALL USED LANGUAGES AMONG THE REPOS
    for (const repo of reposData) {
        if (repo.fork == false) {
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
    let topLangugage = Object.keys(languages[0]);

    // RETURN AN OBJECT WITH ALL OF THE DATA
    return {
        userData, topLangugage, status: 200
    }
}

const requestUser = async (user) => {
    const response = await fetch(`https://api.github.com/users/${user}`);
    // IF THE STATUS CODE IS NOT 200, RETURN IT
    if (response.status != 200) {
        return response.status;
    }
    return response.json();
};

const requestRepos = async (user) => {
    const response = await fetch(`https://api.github.com/users/${user}/repos?type=all`);
    // IF THE STATUS CODE IS NOT 200, RETURN IT
    if (response.status != 200) {
        return response.status;
    }
    return response.json();
};


Array.prototype.findKey = function (key) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].hasOwnProperty(key)) {
            return i;
        }
    }
    return undefined;
};