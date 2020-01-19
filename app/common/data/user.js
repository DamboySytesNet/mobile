exports.user = {
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
