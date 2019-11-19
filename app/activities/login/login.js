// Import nativescript modules
const observableModule = require('tns-core-modules/data/observable');
const dialogsModule = require('tns-core-modules/ui/dialogs');
const frameModule = require('tns-core-modules/ui/frame');

// Import custom modules / datatypes
const auth = require('~/modules/auth/auth');
const logout = require('~/modules/utils/logout');
const u = require('~/common/data/user');

/** Two way binding */
let pageData = new observableModule.fromObject({
    /** User login */
    username: '216000p',
    /** User password */
    password: 'password',

    /** State of authentication */
    loading: false,

    /** Start authentication */
    submit() {
        // Show loading
        this.set('loading', true);

        // Init authentication
        this.login();
    },

    /** Handles authentication */
    login() {
        // Portable user object
        const userData = {
            username: this.username,
            password: this.password
        }

        // Authenticate
        auth.login(userData)
            .then((res) => {
                // Hide loading
                this.set('loading', false);

                // Fill in user data
                u.user.id = res.id;
                u.user.token = res.token;
                u.user.name = res.name;
                u.user.surname = res.surname;
                u.user.room = res.room;

                // Navigate to the right activity
                let moduleName = 'activities/';
                if (res.student)
                    moduleName += 'student/cockpit/cockpit';
                else
                    moduleName += 'employee/cockpit/cockpit';

                frameModule.topmost()
                    .navigate({ moduleName: moduleName });

            }).catch((msg) => {
                // Hide loading
                this.set('loading', false);

                // Inform user that something went wrong
                alert(msg);
            });
    },

    /** Handles 'forget password' option */
    forgotPassword() {
        // Smart email insertion
        let hint = '';
        if (this.username.trim() !== '') {
            if (this.username.indexOf('@') > -1)
                hint = this.username;
            else
                hint = `${this.username}@edu.p.lodz.pl`;
        }

        // Prompot user for email
        dialogsModule.prompt({
            title: 'Przypominanie hasła',
            message: 'Podaj email',
            inputType: 'email',
            defaultText: hint,
            okButtonText: 'Ok',
            cancelButtonText: 'Cancel'
        }).then((data) => {
            // TODO
            if (data.result) {
                // Send forger request
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

/** Onload */
exports.pageLoaded = (args) => {
    // Set page object
    let page = args.object;

    // Set binding context
    page.bindingContext = pageData;

    // Clear user data
    logout.clearUser();
}
