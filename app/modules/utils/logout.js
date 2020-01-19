const u = require("~/common/data/user");

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
        }
    };
};
