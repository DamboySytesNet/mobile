const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");

const u = require("~/common/data/user");

const auth = require("~/modules/auth/auth");
const logout = require("~/modules/utils/logout");
const bell = require("~/modules/utils/animateBell");

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

exports.exit = () => {
    logout.clearUser();
    page.frame.goBack();
};

exports.pageLoaded = args => {
    page = args.object;
    pageData.set("user", `${u.user.name} ${u.user.surname}`);
    bellIcon = page.getViewById("bell");

    let oldValue = u.user.notifications.unread;
    if (oldValue > 0) bell.shake(bellIcon);

    interval = setInterval(() => {
        if (oldValue !== u.user.notifications.unread) {
            if (oldValue < u.user.notifications.unread) bell.shake(bellIcon);
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
