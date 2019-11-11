const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");

const u = require('~/common/data/user');
const date = require('~/common/data/days');

let page;
/** Hours object to be edited */
let el = null;

let pageData = new observableModule.fromObject({
    editing: false,
    timeFromH: null,
    timeFromM: null,
    timeToH: null,
    timeToM: null,
    room: null,
    day: null
});

exports.validate = () => {
    let timeFromH = pageData.get('timeFromH');
    if (timeFromH !== '')
        timeFromH = parseInt(timeFromH);
    else
        timeFromH = 8;

    let timeFromM = pageData.get('timeFromM');
    if (timeFromM !== '')
        timeFromM = parseInt(timeFromM);
    else
        timeFromM = 0;

    let timeToH = pageData.get('timeToH');
    if (timeToH !== '')
        timeToH = parseInt(timeToH);
    else
        timeToH = 9;

    let timeToM = pageData.get('timeToM');
    if (timeToM !== '')
        timeToM = parseInt(timeToM);
    else
        timeToM = 0;


    let room = pageData.get('room');

    if (timeFromH <= 0 || timeFromH > 24) {
        alert('Godzina rozpoczęcia nie jest prawidłowa');
        return;
    }
    if (timeFromM < 0 || timeFromM > 60) {
        alert('Minuty rozpoczęcia nie są prawidłowe');
        return;
    }
    if (timeToH <= 0 || timeToH > 24) {
        alert('Godzina zakończenia nie jest prawidłowa');
        return;
    }
    if (timeToM < 0 || timeToM > 60) {
        alert('Minuty zakończenia nie są prawidłowe');
        return;
    }

    if (room.trim().length === 0) {
        alert('Podany pokój nie jest prawidłowy');
        return;
    }

    if (timeFromM < 10)
        timeFromM = `0${timeFromM}`;

    if (timeToM < 10)
        timeToM = `0${timeFromM}`;

    if (pageData.get('editing')) {
        if (el) {
            el.from = `${timeFromH}:${timeFromM}`;
            el.to = `${timeToH}:${timeToM}`;
            el.room = room;
            el.day = pageData.get('day');
            page.frame.goBack();
        } else {
            alert('Wystąpił błąd podczas przetwarzania...');
        }
    }
}

exports.chooseDay = () => {
    dialogsModule.action({
        message: "Wybierz dzień",
        cancelButtonText: "Anuluj",
        actions: date.daysArray
    }).then((result) => {
        if (result !== 'Anuluj') {
            pageData.set('day', result);
        }
    });
}

exports.pageLoaded = (args) => {
    page = args.object;
    const context = page.navigationContext;

    if (typeof context.id !== 'undefined')
        el = u.user.hours.data.find(el => el.id === context.id)

    if (el) {
        pageData.set('editing', true);

        let from = el.from.split(':');
        let to   = el.to.split(':');

        if (from[1].length === 1)
            from[1] = `0${from[1]}`;
        if (to[1].length === 1)
            to[1] = `0${to[1]}`;

        pageData.set('timeFromH', from[0]);
        pageData.set('timeFromM', from[1]);

        pageData.set('timeToH', to[0]);
        pageData.set('timeToM', to[1]);

        pageData.set('day', el.day);

        pageData.set('room', el.room);
    }
    
    page.bindingContext = pageData; 
}

exports.exit = (args) => {
    page.frame.goBack();
}