const observableModule = require("tns-core-modules/data/observable");

const u = require("~/common/data/user");
const n = require('../../modules/request/notificationsHttpRequests');

let page;
let interval;

let pageData = new observableModule.fromObject({
    notifications: []
});

exports.exit = args => {
    page.frame.goBack();
};

exports.pageLoaded = args => {
    page = args.object;
    n.read();
    pageData.set("notifications", u.user.notifications.data);
    page.bindingContext = pageData;
};

exports.onUnloaded = () => {
    if (interval) clearInterval(interval);
};
