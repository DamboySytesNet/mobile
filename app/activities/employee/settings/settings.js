// Import nativescript modules
const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');

// Import custom modules / datatypes
const u = require('~/common/data/user');
const RoomManager = require('~/modules/request/roomHttpRequests');
const HoursManager = require("~/modules/request/hoursHttpRequests");
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
let page;

/** Edit default room */
exports.editRoom = () => {
    pageData.set('roomEditing', true);
    pageData.set('oldRoom', pageData.get('room'));
}

/** Accept changes to default room */
exports.acceptEditRoom = () => {
    let room = pageData.get('room');

    // Trim room, if empty set to null
    if (room !== null) {
        room = room.trim();
        if (room === '')
            room = null;
    }

    // Update room
    if (room === null || room.length <= 64) {
        pageData.set('roomProcessing', true);
        pageData.set('roomEditing', false);

        RoomManager.set(u.user.id, room, u.user.token)
            .then(() => {
                u.user.room = room;
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

/** Navigate to 'hoursForm' to add new hour */
exports.addNewHour = () => {
    const navigationEntry = {
        moduleName: 'activities/employee/hoursForm/hoursForm'
    };

    frameModule.topmost().navigate(navigationEntry);
}

/** Onload */
exports.pageLoaded = (args) => {
    page = args.object;

    // Display user name and surname
    page.getViewById('username').text = `${u.user.name} ${u.user.surname}`;

    // Load data if it is first time opening this activity
    if (!u.user.hours.loaded) {
        u.user.hours.loaded = true;

        // Get hours from databse
        HoursManager.get(u.user.id, u.user.token)
            .then((res) => {
                // Push hours to user object
                for (let hour of res)
                    u.user.hours.data.push(
                        new Hours.new(hour.id, hour.timeFrom, hour.timeTo, hour.day, hour.room)
                    );

                pageData.set('loading', false);

                page.getViewById('main-list').refresh();
            })
            .catch(() => {
                alert('Nie można pobrać ustawień!');
                page.frame.goBack();
            });
    } else { // Use cache otherwise
        pageData.set('loading', false);
    }

    pageData.set('hours', u.user.hours.data);
    page.bindingContext = pageData;
    
    page.getViewById('main-list').refresh();
}

/** Go back */
exports.exit = () => {
    page.frame.goBack();
}