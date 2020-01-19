const observableModule = require("tns-core-modules/data/observable");
const frameModule = require("tns-core-modules/ui/frame");

const u = require("~/common/data/user");
const logout = require("~/modules/utils/logout");
const n = require('../../common/data/notifications');

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
