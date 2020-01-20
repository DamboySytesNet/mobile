const u = require('~/common/data/user');
const AppData = require('~/common/data/AppData');

/** Remove user cache */
exports.clearUser = () => {
    if (u.user.notifications.interval)
        clearInterval(u.user.notifications.interval);
    u.user = {
        id: null,
        token: null,
        name: null,
        surname: null,
        room: null,
        consultations: {
            loaded: false,
            data: []
        },
        hours: {
            loaded: false,
            data: []
        },
        page: null,

        notifications: {
            latestId: 0,
            unread: 0,
            data: [],
            interval: null
        },

        subjects: {
            loaded: false,
            data: {
                subjectsWithoutUser: [],
                userSubjects: []
            }
        }
    };

    AppData.hours = {
        loaded: false,
        data: []
    };

    AppData.teachers = {
        loaded: false,
        data: []
    };
};
