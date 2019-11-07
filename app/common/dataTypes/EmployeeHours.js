const dialogs = require("tns-core-modules/ui/dialogs");
const Hours = require("~/common/dataTypes/Hours");

exports.new = class eH extends Hours.new {
    edit() {
        console.log(`Edit ${this.id} element`);
    }

    remove() {
        dialogs.confirm('Czy na pewno usunąć te godziny?').then((result) => {
            if (result) {
                
            }
        });
    }
};