import "babel-polyfill";
const colors = window.githubColors;

let oldUser = "";
let primaryColor;
let secondaryColor;
let languages = [];

$(document).ready(() => {
    // HIDING PROFILE DIV   
    $('#profile').hide();

    // EVENTS
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



