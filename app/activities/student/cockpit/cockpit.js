const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');
const dialogsModule = require('tns-core-modules/ui/dialogs');

const auth = require('~/modules/auth/auth');
const u = require('~/common/data/user');
const logout = require('~/modules/utils/logout');

let page;
let interval = null;

let pageData = new observableModule.fromObject({
    user: "",

    numberOfNotifications: 0,

    goToStudentConsultations() {
        let moduleName = "activities/student/consultations/consultations";
        const navigationEntry = {
            moduleName: moduleName
        };

        page.frame.navigate(navigationEntry);
    },

    goToSearch() {
        let moduleName = 'activities/student/search/search';
        const navigationEntry = {
            moduleName: moduleName
        };
        frameModule.topmost().navigate(navigationEntry);
    },

    goToNotifications() {
        page.frame.navigate({
            moduleName: "activities/notifications/notifications"
        });
    }
});

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

exports.exit = (args) => {
    const button = args.object;
    const page = button.page;
    logout.clearUser();
    page.frame.goBack();
};

exports.pageLoaded = args => {
    page = args.object;
    pageData.set("user", `${u.user.name} ${u.user.surname}`);

    let oldValue = u.user.notifications.unread;
    if (oldValue > 0) animateBell();

    interval = setInterval(() => {
        if (oldValue !== u.user.notifications.unread) {
            animateBell();
            oldValue = u.user.notifications.unread;
            pageData.set(
                "numberOfNotifications",
                `${u.user.notifications.unread}`
            );
        }
    }, 1000);
    page.bindingContext = pageData;
    bells = page.getViewById("bell");
};

exports.onUnloaded = () => {
    if (interval) clearInterval(interval);
};

function animateBell() {
    bells
        .animate({
            rotate: 40,
            duration: 270,
            scale: {
                x: 1.3,
                y: 1.3
            }
        })
        .then(() => {
            return bells.animate({
                rotate: -40,
                duration: 270
            });
        })
        .then(() => {
            return bells.animate({
                rotate: 0,
                duration: 270,
                scale: {
                    x: 1,
                    y: 1
                }
            });
        });
}
