const u = require('~/common/data/user');

/** Remove user cache */
exports.clearUser = () => {
    u.user = {
        id: null,
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
            data: []
        }
    };
}