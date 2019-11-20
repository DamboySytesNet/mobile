const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");

const Hours = require("~/common/dataTypes/EmployeeHours");
const HoursManager = require("~/modules/request/hours");
const u = require('~/common/data/user');
const date = require('~/common/data/days');

/** Hours object to be edited */
let el = null;
let page;
let queue = false;

/** All new data that is to be inserted into object */
let pageData = new observableModule.fromObject({
    editing: false,
    timeFromH: '',
    timeFromM: '',
    timeToH: '',
    timeToM: '',
    room: '',
    day: null
});

/**
 * Validates the user input and
 * returns object with validated data, or false otherwise
 */
function validate() {
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
        return false;
    }
    if (timeFromM < 0 || timeFromM >= 60) {
        alert('Minuty rozpoczęcia nie są prawidłowe');
        return false;
    }
    if (timeToH < 0 || timeToH > 24) {
        alert('Godzina zakończenia nie jest prawidłowa');
        return false;
    }

    if (timeToM < 0 || timeToM >= 60) {
        alert('Minuty zakończenia nie są prawidłowe');
        return false;
    }

    if (room === null ||
        room.trim().length === 0)
    {
        alert('Podany pokój nie jest prawidłowy');
        return false;
    }

    if (timeFromH < 10)
        timeFromH = `0${timeFromH}`;

    if (timeFromM < 10)
        timeFromM = `0${timeFromM}`;

    if (timeToH < 10)
        timeToH = `0${timeToH}`;

    if (timeToM < 10)
        timeToM = `0${timeToM}`;

    let day = pageData.get('day');
    let dayId = date.daysArray.indexOf(day);

    if (dayId < 0) {
        alert('Dzień tygodnia nie jest prawidłowy!');
        return false;
    }

    return {
        room: room,
        from: `${timeFromH}:${timeFromM}`,
        to: `${timeToH}:${timeToM}`,
        day: day,
        dayId: dayId + 1 // (+ 1) because index starts from 0, but monday is 1
    };
}

/** Add new hours or edit existing ones */
exports.accept = () => {
    if (queue)
        return;

    queue = true;
    const validated = validate();

    if (validated) {
        if (pageData.get('editing')) {
            if (el) {
                if (el.from === validated.from && 
                    el.to === validated.to &&
                    el.room === validated.room &&
                    el.day === validated.day
                ) {
                    page.frame.goBack();
                    queue = false;
                    return;
                }

                HoursManager.set(el.id,
                                 validated.room,
                                 validated.dayId,
                                 validated.from,
                                 validated.to,
                                 u.user.token)
                    .then(() => {
                        el.from = validated.from;
                        el.to = validated.to;
                        el.room = validated.room;
                        el.day = validated.day;

                        page.frame.goBack();
                        queue = false;
                    })
                    .catch(() => {
                        alert({
                            title: 'Uwaga',
                            message: 'Nie udało się zaktualizować godzin konsultacji!',
                            okButtonText: 'OK'
                        });

                        queue = false;
                    });
            } else {
                alert('Wystąpił błąd podczas przetwarzania...');
            }
        } else {
            HoursManager.add(u.user.id,
                             validated.room,
                             validated.dayId,
                             validated.from,
                             validated.to,
                             u.user.token)
                .then(id => {
                    u.user.hours.data.push(
                        new Hours.new(
                            id, 
                            validated.from,
                            validated.to,
                            validated.day,
                            validated.room
                        )
                    );

                    page.frame.goBack();
                    queue = false;
                })
                .catch(() => {
                    alert({
                        title: 'Uwaga',
                        message: 'Nie udało się dodać godzin konsultacji!',
                        okButtonText: 'OK'
                    });
                    queue = false;
                });
        }
    }
}

/** Choosing day dialog */
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

/** 
 * Fill forms if editing object,
 * clears everyting if creating new object
 */
exports.pageLoaded = (args) => {
    page = args.object;
    const context = page.navigationContext;

    if (typeof context !== 'undefined')
        el = u.user.hours.data.find(el => el.id === context.id)
    else
        el = null;

    if (el !== null) {
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
    } else {
        pageData.set('editing', false);
        pageData.set('day', 'poniedziałek');
        pageData.set('timeFromH', '');
        pageData.set('timeFromM', '');
        pageData.set('timeToH', '');
        pageData.set('timeToM', '');
        pageData.set('room', u.user.room);
    }
    
    page.bindingContext = pageData; 
}

/** Exit current frame */
exports.exit = (args) => {
    // let view = args.object;
    // let page = view.page;
    page.frame.goBack();
}