const observableModule = require('tns-core-modules/data/observable');
const dialogsModule = require('tns-core-modules/ui/dialogs');
const topmost = require('tns-core-modules/ui/frame').topmost;

const auth = require('~/modules/auth/auth');

var pageData = new observableModule.fromObject({
    username: '216000',
    password: 'password',
    confirmPassword: 'password',
    loading: false,

    submit() {
        this.set('loading', true);
        this.login();
    },

    login() {
        auth.login({
            username: this.username,
            password: this.password
        }).then((msg) => {
            alert('logged');
            this.set('loading', false);

            // topmost().navigate({
            //     moduleName: '/home/home-page',
            //     clearHistory: true
            // });
        }).catch((msg) => {
            alert(msg);
            this.set('loading', false);
        });
    },

    forgotPassword() {
        dialogsModule.prompt({
            title: 'Przypominanie hasła',
            message: 'Podaj email',
            inputType: 'email',
            defaultText: '',
            okButtonText: 'Ok',
            cancelButtonText: 'Cancel'
        }).then((data) => {
            if (data.result) {
                // userService.resetPassword(data.text.trim())
                //     .then(() => {
                //         alert('Your password was successfully reset. Please check your email for instructions on choosing a new password.');
                //     }).catch(() => {
                //         alert('Unfortunately, an error occurred resetting your password.');
                //     });
            }
        });
    }
});

exports.pageLoaded = (args) => {
    const page = args.object;
    page.bindingContext = pageData;
}
