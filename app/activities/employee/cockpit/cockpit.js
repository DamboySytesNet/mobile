const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');
const dialogsModule = require('tns-core-modules/ui/dialogs');

const auth = require('~/modules/auth/auth');
const u = require('~/common/data/user');
const logout = require('~/modules/utils/logout');

//! TODO: notification cannot exceed 99

let pageData = new observableModule.fromObject({
    user: '',
    numberOfNotifications: 69,

    // w celach testowych:
    alertNotification() {
        this.numberOfNotifications++;
        animateBell();

        pageData.consultations[0]
    },

    goToEmployeeConsultations() {
        let moduleName = 'activities/employee/consultations/consultations';
        const navigationEntry = {
            moduleName: moduleName,
        };

        frameModule.topmost().navigate(navigationEntry);
    },

    goToEmployeeSubjects() {
        //frameModule.topmost().navigate(navigationEntry);
    },

    goToEmployeeSettings() {
        frameModule.topmost().navigate({
            moduleName: 'activities/employee/settings/settings'
        });
    }

});

exports.exit = (args) => {
    logout.clearUser();
    let view = args.object;
    let page = view.page;
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    pageData.set('user', `${u.user.name} ${u.user.surname}`);
    page.bindingContext = pageData;
    bells = page.getViewById('bell');
}

exports.changePassword = () => {
    // Prompot user for new password
    dialogsModule.prompt({
        title: 'Ustawianie hasła',
        message: 'Podaj nowe hasło',
        inputType: 'password',
        defaultText: '',
        okButtonText: 'Ok',
        cancelButtonText: 'Cancel'
    }).then((data) => {
        if (data.result) {
            dialogsModule.prompt({
                title: 'Ustawianie hasła',
                message: 'Podaj nowe ponownie hasło',
                inputType: 'password',
                defaultText: '',
                okButtonText: 'Ok',
                cancelButtonText: 'Cancel'
            }).then((data2) => {
                if (data.result) {
                    if (data.text === data2.text) {
                        // Send request
                        auth.changePassword(u.user.id, u.user.token, data.text)
                            .then((msg) => {
                                alert(msg);
                            })
                            .catch((msg) => {
                                alert(msg);
                            });
                    } else {
                        alert('Hasła się nie zgadzają!');
                    }
                }
            }).catch((msg) => {
                alert(msg);
            });
        }
    }).catch((msg) => {
        alert(msg);
    });
}


function animateBell() {
    bells.animate({
            rotate: 40,
            duration: 270,
            scale: {
                x: 1.3,
                y: 1.3
            },
        })
        .then(() => {
            return bells.animate({
                rotate: -40,
                duration: 270,
            });
        })
        .then(() => {
            return bells.animate({
                rotate: 0,
                duration: 270,
                scale: {
                    x: 1,
                    y: 1
                },
            });
        });
}
