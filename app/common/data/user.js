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
    subjects: {
        loaded: false,
        data: {
            withoutUserSubjects: [],
            userSubjects: []
        }
    },
    page: null
};