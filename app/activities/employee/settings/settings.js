// Import nativescript modules
const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');

// Import custom modules / datatypes
const u = require('~/common/data/user');
const RoomSetter = require('~/modules/set/room');
const HoursGetter = require('~/modules/get/hours');
const Hours = require("~/common/dataTypes/EmployeeHours");

/** Two way binding */
let pageData = new observableModule.fromObject({
    /** Current default room */
    room: u.user.room,
    /** Default room backup */
    oldRoom: '',
    /** Room is being edited */
    roomEditing: false,
    /** Changes are sent to sever */
    roomProcessing: false,

    /** Hours for listview */
    hours: [],

    /** Loading base data from server */
    loading: true
});

/** Edit default room */
exports.editRoom = () => {
    pageData.set('roomEditing', true);
    pageData.set('oldRoom', pageData.get('room'));
}

/** Accept changes to default room */
exports.acceptEditRoom = () => {
    let room = pageData.get('room');

    if (room !== null)
        room = room.trim();

    if (room === null || room.length <= 64) {
        pageData.set('roomProcessing', true);
        pageData.set('roomEditing', false);

        RoomSetter.set(u.user.id, u.user.room, u.user.token)
            .then(() => {
                pageData.set('roomProcessing', false);
            })
            .catch(() => {
                alert({
                    title: 'Uwaga',
                    message: 'Nie udało się zapisać domyślnego pokoju!',
                    okButtonText: 'OK'
                });

                pageData.set('roomProcessing', false);
                pageData.set('roomEditing', true);
            });
    } else {
        alert({
            title: 'Uwaga',
            message: 'Pokój nie może przekroczyć 64 znaków!',
            okButtonText: 'OK'
        });
    }
}

/** Deny changes to default room */
exports.cancelEditRoom = () => {
    pageData.set('roomEditing', false);
    pageData.set('room', pageData.get('oldRoom'));
}

function deleteHour(page, id) {
    let it = 0;
    for (let el of u.user.hours.data) {
        if (el.id === id) {
            // TODO
            u.user.hours.data.splice(it, 1);
            page.getViewById('main-list').refresh();
            return;
        }
        it++;
    }
}

exports.addNewHour = () => {
    const navigationEntry = {
        moduleName: 'activities/employee/hoursForm/hoursForm'
    };

    frameModule.topmost().navigate(navigationEntry);
}

/** Onload */
exports.pageLoaded = (args) => {
    let page = args.object;

    // Display user name and surname
    page.getViewById('username').text = `${u.user.name} ${u.user.surname}`;

    // Load data if it is first time opening this activity
    if (!u.user.hours.loaded) {
        // Set up cache flag
        u.user.hours.loaded = true;

        // Get hours from databse
        HoursGetter.get(u.user.id, u.user.token)
            .then((res) => {
                // Push hours to user object
                for (let hour of res)
                    u.user.hours.data.push(
                        new Hours.new(hour.id, hour.timeFrom, hour.timeTo, hour.day, hour.room,
                            (details) => {
                                if (details.actionType === 0)
                                    deleteHour(page, details.id);
                            }
                        )
                    );

                // Hide loading
                pageData.set('loading', false);

                // Refresh ListView
                page.getViewById('main-list').refresh();
            })
            .catch(() => {
                alert('Nie można pobrać ustawień!');
                page.frame.goBack();
            });
    } else { // Use cache otherwise
        //Hide loading
        pageData.set('loading', false);
    }

    // Set up two way binding on hours
    pageData.set('hours', u.user.hours.data);

    // Set binding context
    page.bindingContext = pageData;

    // Refresh ListView
    page.getViewById('main-list').refresh();
}

/** Go back */
exports.exit = (args) => {
    let view = args.object;
    let page = view.page;
    page.frame.goBack();
}