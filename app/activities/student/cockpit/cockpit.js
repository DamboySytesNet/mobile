const observableModule = require("tns-core-modules/data/observable");
const frameModule = require("tns-core-modules/ui/frame");

const u = require("~/common/data/user");
const logout = require("~/modules/utils/logout");
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
    }
});

exports.exit = args => {
    logout.clearUser();
    page.frame.goBack();
};

exports.toNotifications = () => {
    let moduleName = "activities/notifications/notifications";
    const navigationEntry = {
        moduleName: moduleName
    };
    page.frame.navigate(navigationEntry);
};

exports.pageLoaded = args => {
    page = args.object;
    pageData.set("user", `${u.user.name} ${u.user.surname}`);

    interval = setInterval(() => {
        pageData.set("numberOfNotifications", `${u.user.notifications.unread}`);
    }, 1000);
    page.bindingContext = pageData;
};

exports.onUnloaded = () => {
    if (interval) clearInterval(interval);
};
