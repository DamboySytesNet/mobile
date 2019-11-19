const dialogs = require("tns-core-modules/ui/dialogs");
const frameModule = require('tns-core-modules/ui/frame');

const u = require('~/common/data/user');
const Hours = require("~/common/dataTypes/Hours");
const HoursRemover = require("~/modules/remove/hours");

exports.new = class eH extends Hours.new {
    constructor(id, from, to, day, room, callback) {
        super(id, from, to, day, room)
        
        this.callback = callback;
    }

    edit() {
        const navigationEntry = {
            moduleName: 'activities/employee/hoursForm/hoursForm',
            context: {
                id: this.id
            }
        };

        frameModule.topmost().navigate(navigationEntry);
    }

    remove() {
        dialogs.confirm('Czy na pewno usunąć te godziny?').then((result) => {
            if (result) {
                HoursRemover.remove(this.id, u.user.token)
                    .then(() => {
                        this.callback({
                            id: this.id,
                            actionType: 0
                        });
                    })
                    .catch((msg) => {
                        alert({
                            title: 'Uwaga',
                            message: 'Nie udało się usunąć godzin konsultacji!',
                            okButtonText: 'OK'
                        });
                    });
                
            }
        });
    }
};