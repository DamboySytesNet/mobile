const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');
const dialogsModule = require('tns-core-modules/ui/dialogs');

const auth = require('~/modules/auth/auth');
const u = require('~/common/data/user');
const logout = require('~/modules/utils/logout');

let pageData = new observableModule.fromObject({
    user: '',

    goToStudentConsultations() {
        let moduleName = 'activities/student/consultations/consultations';
        const navigationEntry = {
            moduleName: moduleName
        };
        frameModule.topmost().navigate(navigationEntry);
    },

    goToSearch() {
        let moduleName = 'activities/student/search/search';
        const navigationEntry = {
            moduleName: moduleName
        };
        frameModule.topmost().navigate(navigationEntry);
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
}

exports.pageLoaded = (args) => {
    let page = args.object;
    pageData.set('user', `${u.user.name} ${u.user.surname}`);
    page.bindingContext = pageData;
}
