const u = require('~/common/data/user');

/** Remove user cache */
exports.clearUser = () => {
    u.user = {
        id: null,
        name: null,
        surname: null,
        room: null,
        consultations: [],
        hours: {
            loaded: false,
            data: []
        }
    };
}