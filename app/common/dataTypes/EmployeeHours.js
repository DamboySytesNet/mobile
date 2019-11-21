const dialogs = require("tns-core-modules/ui/dialogs");
const frameModule = require('tns-core-modules/ui/frame');

const u = require('~/common/data/user');
const Hours = require("~/common/dataTypes/Hours");
const HoursManager = require("~/modules/request/hoursHttpRequests");


exports.new = class eH extends Hours.new {
    constructor(id, from, to, day, room) {
        super(id, from, to, day, room);
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

    remove(args) {
        let page = args.view.page;

        dialogs.confirm('Czy na pewno usunąć te godziny?').then((result) => {
            if (result) {
                HoursManager.remove(this.id, u.user.token)
                    .then(() => {
                        u.user.hours.data.find((el, it) => {
                            if (el.id === this.id) {
                                u.user.hours.data.splice(it, 1);
                                return true;
                            }
                            return false;
                        });

                        page.getViewById('main-list').refresh();
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