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
        const data = await request(userInput.val());
        avatarImg.attr('src', data.avatar_url);

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

        profileDiv.slideDown(250);
        userP.text(data.name);
    })
});

const request = async (user) => {
    const response = await fetch(`https://api.github.com/users/${user}`);
    const data = await response.json();
    return data;
};