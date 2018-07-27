import 'babel-polyfill';
import { requestData, handleError, updateDOM, animations } from './util.js';

let oldUser = "";
let primaryColor;
let secondaryColor;
let languages = [];
let includeForks = false;

$(document).ready(() => {

    // HIDING PROFILE DIV   
    $('#profile').hide();
    $('#main').hide();
    $('#main').slideDown(500);

    $('html, body').animate({ scrollTop: $('#logo').offset().top }, 'slow'); // scroll to logo in order to center view on page load

    // EVENTS
    $('#user').keypress(function (event) {
        if (event.keyCode == 13) {
            const user = $('#user').val();

            if (user !== oldUser || includeForks != $('#enable-forks').is(':checked')) {
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
        }
    });

    let toggleAbout = false;

    $('#about').click(() => {
        anime({
            targets: "#main",
            rotate: (toggleAbout == false) ? '8turn' : 0,
            scale: [
                { value: 0.25, duration: 500 },
                { value: 1, duration: 500 },
            ],
            update: function () {
                if (toggleAbout) {
                    $('#main-content').hide();
                    $('#about-content').show();
                    $('#main').css('paddingBottom', 0);
                } else {
                    $('#main-content').show();
                    $('#about-content').hide();
                    $('#main').css('paddingBottom', '5%');

                }
            },
            duration: 1000,
            easing: 'easeOutQuart'
        });

        toggleAbout = !toggleAbout;

    });
});

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
            includeForks = $('#enable-forks').is(':checked');
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
    animations(primaryColor, secondaryColor);
    $('html, body').animate({ scrollTop: $('#profile').offset().top }, 'slow'); // scroll to profile div
    oldUser = user;
}