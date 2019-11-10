const dialogs = require("tns-core-modules/ui/dialogs");
const Hours = require("~/common/dataTypes/Hours");

exports.new = class eH extends Hours.new {
    constructor(id, from, to, day, room, callback) {
        super(id, from, to, day, room)
        
        this.callback = callback;
    }

    edit() {
        console.log(`Edit ${this.id} element`);
        // this.callback();
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