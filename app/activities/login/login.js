const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");
const topmost = require("tns-core-modules/ui/frame").topmost;

const auth = require("~/modules/auth/auth");

var pageData = new observableModule.fromObject({
    username: '216000',
    password: 'password',
    confirmPassword: 'password',
    isLoggingIn: true,
    loading: false,

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    },

    submit() {
        if (this.username.trim() === '' ||
            this.password.trim() === '') {
            alert('Podaj login oraz hasło!');
            return;
        }

        this.set("loading", true);

        if (this.isLoggingIn)
            this.login();
        else
            this.register();
    },

    login() {
        auth.login({
            username: this.username,
            password: this.password
        }).then((msg) => {
            alert('logged');
            this.set("loading", false);

            // topmost().navigate({
            //     moduleName: "/home/home-page",
            //     clearHistory: true
            // });
        }).catch((msg) => {
            alert(msg);
            this.set("loading", false);
        });
    },
    
    register() {
        if (this.password !== this.confirmPassword) {
            alert('Hasło się nie zgadzają!');
            return;
        }

        auth.login({
            username: this.username,
            password: this.password
        }).then((msg) => {
            alert('logged');
            this.set("loading", false);

            // topmost().navigate({
            //     moduleName: "/home/home-page",
            //     clearHistory: true
            // });
        }).catch((msg) => {
            alert(msg);
            this.set("loading", false);
        });
    },
    forgotPassword() {
        dialogsModule.prompt({
            title: "Forgot Password",
            message: "Enter the email address you used to register for APP NAME to reset your password.",
            inputType: "email",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then((data) => {
            if (data.result) {
                // userService.resetPassword(data.text.trim())
                //     .then(() => {
                //         alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                //     }).catch(() => {
                //         alert("Unfortunately, an error occurred resetting your password.");
                //     });
            }
        });
    }
});

exports.pageLoaded = (args) => {
    const page = args.object;
    page.bindingContext = pageData;
}
