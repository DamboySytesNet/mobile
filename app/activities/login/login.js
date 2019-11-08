const observableModule = require('tns-core-modules/data/observable');
const dialogsModule = require('tns-core-modules/ui/dialogs');
const frameModule = require('tns-core-modules/ui/frame');

let page;
const auth = require('~/modules/auth/auth');
const u = require('~/common/data/user');

let pageData = new observableModule.fromObject({
    username: '216000p',
    password: 'password',
    loading: false,

    submit() {
        this.set('loading', true);
        this.login();
    },

    login() {
        const userData = {
            username: this.username,
            password: this.password
        }
        auth.login(userData)
            .then((res) => {
                this.set('loading', false);

                u.user.id = res.id;
                u.user.name = res.name;
                u.user.surname = res.surname;

                let moduleName = 'activities/';
                if (res.student)
                    moduleName += 'student/cockpit/cockpit';
                else
                    moduleName += 'employee/cockpit/cockpit';

                frameModule.topmost()
                    .navigate({ moduleName: moduleName });

            }).catch((msg) => {
                this.set('loading', false);
                alert(msg);
            });
    },

    forgotPassword() {
        let hint = '';
        if (this.username.trim() !== '') {
            if (this.username.indexOf('@') > -1)
                hint = this.username;
            else
                hint = `${this.username}@edu.p.lodz.pl`;
        }
        dialogsModule.prompt({
            title: 'Przypominanie hasła',
            message: 'Podaj email',
            inputType: 'email',
            defaultText: hint,
            okButtonText: 'Ok',
            cancelButtonText: 'Cancel'
        }).then((data) => {
            if (data.result) {
                auth.forgotPassword(data.text)
                    .then((mail) => {
                        alert(`E-mail został wysłany na ${mail}`);
                    })
                    .catch((msg) => {
                        alert(msg);
                    });
            }
        }).catch((msg) => {
            alert(msg);
        });
    }
});

exports.pageLoaded = (args) => {
    page = args.object;
    page.bindingContext = pageData;
}
