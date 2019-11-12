const dialogs = require("tns-core-modules/ui/dialogs");
const frameModule = require('tns-core-modules/ui/frame');

const Hours = require("~/common/dataTypes/Hours");

exports.new = class eH extends Hours.new {
    constructor(id, from, to, day, room, callback) {
        super(id, from, to, day, room)
        
        this.callback = callback;
    }

    edit() {
        const navigationEntry = {
            moduleName: 'activities/employee/hoursForm/hours',
            context: {
                id: this.id
            }
        };

        frameModule.topmost().navigate(navigationEntry);
    }

    remove() {
        dialogs.confirm('Czy na pewno usunąć te godziny?').then((result) => {
            if (result) {
                this.callback({
                    id: this.id,
                    actionType: 0
                });
            }
        });
    }
};