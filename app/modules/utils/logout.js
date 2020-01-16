const u = require('~/common/data/user');
const AppData = require('~/common/data/AppData');

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
        }
    };

    AppData.hours = {
        loaded: false,
        data:[]
    };

    AppData.teachers = {
        loaded: false,
        data:[]
    };


}