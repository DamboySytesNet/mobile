const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');

const u = require('~/common/data/user');
const logout = require('~/modules/utils/logout');

let page;

//! TODO: notification cannot exceed 99

let pageData = new observableModule.fromObject({
    user: '',
    numberOfNotifications: 69,

    // w celach testowych:
    alertNotification() {
       this.numberOfNotifications++;
       animateBell();
    },
    
    goToEmployeeConsultations() {
        let moduleName = 'activities/employee/consultations/consultations';
        const navigationEntry = {
            moduleName: moduleName,
            context: {
                user: this.user,
                numberOfNotifications: this.numberOfNotifications
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
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    page = args.object;
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