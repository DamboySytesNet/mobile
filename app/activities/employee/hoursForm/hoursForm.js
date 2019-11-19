const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");

const Hours = require("~/common/dataTypes/EmployeeHours");
const HoursManager = require("~/modules/request/hours");
const u = require('~/common/data/user');
const date = require('~/common/data/days');

/** Hours object to be edited */
let el = null;
let page;

let pageData = new observableModule.fromObject({
    editing: false,
    timeFromH: '',
    timeFromM: '',
    timeToH: '',
    timeToM: '',
    room: '',
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

    if (room === null ||
        room.trim().length === 0)
    {
        alert('Podany pokój nie jest prawidłowy');
        return;
    }

    if (timeFromH < 10)
        timeFromH = `0${timeFromH}`;

    if (timeFromM < 10)
        timeFromM = `0${timeFromM}`;

    if (timeToH < 10)
        timeToH = `0${timeToH}`;

    if (timeToM < 10)
        timeToM = `0${timeToM}`;

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
    } else {
        let day = pageData.get('day');
        let dayId = date.daysArray.indexOf(day);

        if (dayId > -1) {
            HoursManager.add(u.user.id,
                             room,
                             dayId + 1, //because index starts from 0, but monday is 1
                             `${timeFromH}:${timeFromM}`,
                             `${timeToH}:${timeToM}`,
                             u.user.token)
                .then(id => {
                    u.user.hours.data.push(
                        new Hours.new(
                            id, 
                            `${timeFromH}:${timeFromM}`,
                            `${timeToH}:${timeToM}`,
                            pageData.get('day'),
                            room
                        )
                    );

                    page.frame.goBack();
                })
                .catch(() => {
                    alert({
                        title: 'Uwaga',
                        message: 'Nie udało się dodać godzin konsultacji!',
                        okButtonText: 'OK'
                    });
                });
        } else {
            alert({
                title: 'Uwaga',
                message: 'Dzień nie jest poprawny!',
                okButtonText: 'OK'
            });
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

    if (typeof context !== 'undefined')
        el = u.user.hours.data.find(el => el.id === context.id)
    else {
        pageData.set('editing', false);
        pageData.set('day', 'poniedziałek');
        pageData.set('timeFromH', '');
        pageData.set('timeFromM', '');
        pageData.set('timeToH', '');
        pageData.set('timeToM', '');
        pageData.set('room', u.user.room);
    }

    if (el) {
        pageData.set('editing', true);

        let from = el.from.split(':');
        let to   = el.to.split(':');

        if (from[0].length === 1)
            from[0] = `0${from[0]}`;

        if (to[0].length === 1)
            to[0] = `0${to[0]}`;

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
    // let view = args.object;
    // let page = view.page;
    page.frame.goBack();
}