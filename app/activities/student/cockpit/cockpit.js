const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');

const u = require('~/common/data/user');
const logout = require('~/modules/utils/logout');

let pageData = new observableModule.fromObject({
    user: '',

    goToStudentConsultations() {
        let moduleName = 'activities/student/consultations/consultations';
        const navigationEntry = {
            moduleName: moduleName
        };
        // alert("alert!");
        frameModule.topmost().navigate(navigationEntry);
    }

});

exports.exit = (args) => {
    const button = args.object;
    const page = button.page;
    logout.clearUser();
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    pageData.set('user', `${u.user.name} ${u.user.surname}`);
    page.bindingContext = pageData;
}