$(document).ready(() => {

    // INSTANCES OF DOM ELEMENTS
    const profileDiv = $('#profile');
    const avatarImg = $('#avatar');
    const userInput = $('#user');
    const userP = $('#username');

    // HIDING PROFILE DIV   
    profileDiv.hide();

    // EVENTS
    $('#search').click(async () => {
        const user = userInput.val();
        let languages = [];

        const userData = await requestUser(user);
        avatarImg.attr('src', userData.avatar_url);
        const reposData = await requestRepos(user);

        for (const repo of reposData) {
            if (repo.fork == false) {
                let language = repo.language;
                if (language === null) {
                    continue;
                }
                let index = findKeyInArray(languages, language);
                if (index != undefined) {
                    languages[index][language]++;
                } else {
                    languages.push({ [language]: 1 });
                }
            }
        }

        languages = languages.sort((a, b) => {
            let first = Object.values(a);
            let second = Object.values(b);
            return second - first;
        });

        userP.text(userData.name ? userData.name : userData.login);
        animations(profileDiv);
    })
});

const requestUser = async (user) => {
    const response = await fetch(`https://api.github.com/users/${user}`);
    const data = await response.json();
    return data;
};

const requestRepos = async (user) => {
    const response = await fetch(`https://api.github.com/users/${user}/repos?type=all`);
    const data = await response.json();
    return data;
};

const animations = (profileDiv, primaryColor, secondaryColor) => {
    // PRIMARY
    anime({
        targets: ".lang-color-primary",
        fill: '#701516',
        color: '#701516',
        easing: 'easeOutQuart'
    });
    anime({
        targets: "body",
        backgroundColor: '#701516',
        easing: 'easeOutQuart'
    });

    // SECONDARY
    anime({
        targets: ".btn",
        backgroundColor: '#601415',
        boxShadow: '0 0 10px #601415',
        easing: 'easeOutQuart'
    });
    anime({
        targets: ".lang-color-secondary",
        fill: '#601415',
        color: '#601415',
        easing: 'easeOutQuart'
    });

    // DIV SLIDE DOWN
    profileDiv.slideDown(250);
};

const findKeyInArray = (arr, key) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].hasOwnProperty(key)) {
            return i;
        }
    }
    return undefined;
};
