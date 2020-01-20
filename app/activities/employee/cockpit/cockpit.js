const observableModule = require("tns-core-modules/data/observable");

const frameModule = require("tns-core-modules/ui/frame");
const dialogsModule = require("tns-core-modules/ui/dialogs");

const auth = require("~/modules/auth/auth");
const u = require("~/common/data/user");
const logout = require("~/modules/utils/logout");

let page;
let bells;
let interval = null;

let pageData = new observableModule.fromObject({
    user: "",
    numberOfNotifications: 0,

    goToEmployeeConsultations() {
        page.frame.navigate({
            moduleName: "activities/employee/consultations/consultations"
        });
    },

    goToEmployeeSubjects() {
        page.frame.navigate({
            moduleName: "activities/employee/subjects/subjects"
        });
    },

    goToEmployeeSettings() {
        page.frame.navigate({
            moduleName: "activities/employee/settings/settings"
        });
    },

    goToNotifications() {
        page.frame.navigate({
            moduleName: "activities/notifications/notifications"
        });
    }
});

exports.exit = args => {
    logout.clearUser();
    let view = args.object;
    page = view.page;
    page.frame.goBack();
};

exports.pageLoaded = args => {
    page = args.object;
    pageData.set("user", `${u.user.name} ${u.user.surname}`);
    bells = page.getViewById("bell");

    let oldValue = u.user.notifications.unread;
    if (oldValue > 0) animateBell();

    interval = setInterval(() => {
        if (oldValue < u.user.notifications.unread) {
            animateBell();
            oldValue = u.user.notifications.unread;
            pageData.set(
                "numberOfNotifications",
                `${u.user.notifications.unread}`
            );
        }
    }, 1000);

    page.bindingContext = pageData;
};

exports.onUnloaded = () => {
    if (interval) clearInterval(interval);
};

exports.changePassword = () => {
    // Prompot user for new password
    dialogsModule
        .prompt({
            title: "Ustawianie hasła",
            message: "Podaj nowe hasło",
            inputType: "password",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        })
        .then(data => {
            if (data.result) {
                dialogsModule
                    .prompt({
                        title: "Ustawianie hasła",
                        message: "Podaj nowe ponownie hasło",
                        inputType: "password",
                        defaultText: "",
                        okButtonText: "Ok",
                        cancelButtonText: "Cancel"
                    })
                    .then(data2 => {
                        if (data.result) {
                            if (data.text === data2.text) {
                                // Send request
                                auth.changePassword(
                                    u.user.id,
                                    u.user.token,
                                    data.text
                                )
                                    .then(msg => {
                                        alert(msg);
                                    })
                                    .catch(msg => {
                                        alert(msg);
                                    });
                            } else {
                                alert("Hasła się nie zgadzają!");
                            }
                        }
                    })
                    .catch(msg => {
                        alert(msg);
                    });
            }
        })
        .catch(msg => {
            alert(msg);
        });
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
