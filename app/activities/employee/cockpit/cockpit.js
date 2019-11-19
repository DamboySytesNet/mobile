const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');

const u = require('~/common/data/user');
const logout = require('~/modules/utils/logout');

//! TODO: notification cannot exceed 99

let pageData = new observableModule.fromObject({
    user: '',
    notifications: 0,

    // w celach testowych:
    alertNotification() {
       this.notifications++;
       animateBell();

       pageData.consultations[0]
    },
    
    goToEmployeeConsultations() {
        let moduleName = 'activities/employee/consultations/consultations';
        const navigationEntry = {
            moduleName: moduleName,
            context: {
                user: user,
            }
        };

        frameModule.topmost().navigate(navigationEntry);
    },

    goToEmployeeSubjects() {
        //frameModule.topmost().navigate(navigationEntry);
    },

    goToEmployeeSettings() {
        frameModule.topmost() .navigate(
            { moduleName: 'activities/employee/settings/settings' }
        );
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
    bells = page.getViewById("bell");
}




function animateBell() {
    bells.animate({
        rotate: 40,
        duration: 270,
        scale: {x: 1.3, y: 1.3},
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
            scale: {x: 1, y: 1},
        });
    });
}