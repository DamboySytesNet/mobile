const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');

const u = require('~/common/data/user');
const logout = require('~/modules/utils/logout');

let page;

//! TODO: notification cannot exceed 99

// let testConsultation = [
//     {
//         id: 1,
//         student: 'Adrian Adriański',
//         room: 243,
//         date: new Date(2019, 10, 30, 10, 30),
//     },
//     {
//         id: 2,
//         student: 'Damian Kołek',
//         room: 211,
//         date: new Date(2019, 11, 22, 8, 15),
//     }
// ];

// let employee = {
//     id: 123456,
//     name: 'testName',
//     surname: 'testSurname',
//     consultations: testConsultation,
// }

let pageData = new observableModule.fromObject({
    user: '',
    notifications: 0,


    // w celach testowych:
    alertNotification() {
       this.notifications++;
       animateBell();
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