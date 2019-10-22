const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");
const topmost = require("tns-core-modules/ui/frame").topmost;

// // const userService = require("~/services/user-service");


function LoginViewModel() {
    return observableModule.fromObject({
        email: "user@nativescript.org",
        password: "password",
        confirmPassword: "",
        isLoggingIn: true,
        processing: false,

        toggleForm() {
            this.isLoggingIn = !this.isLoggingIn;
        },

        submit() {
            if (this.email.trim() === "" || this.password.trim() === "") {
                alert("Please provide both an email address and password.");
                return;
            }

            this.set("processing", true);
            if (this.isLoggingIn) {
                this.login();
            } else {
                this.register();
            }
        },

        login() {
            // userService.login({
            //     email: this.email,
            //     password: this.password
            // }).then(() => {
            //     this.set("processing", false);
            //     topmost().navigate({
            //         moduleName: "/home/home-page",
            //         clearHistory: true
            //     });
            // }).catch((e) => {
            //     this.set("processing", false);
            //     console.log(e);
            //     alert("Unfortunately we could not find your account.");
            // });
        },
        register() {
            if (this.password != this.confirmPassword) {
                alert("Your passwords do not match.");
                return;
            }
            // userService.register({
            //     email: this.email,
            //     password: this.password
            // }).then(() => {
            //     this.set("processing", false);
            //     alert("Your account was successfully created. You can now login.");
            //     this.isLoggingIn = true;
            // })
            //     .catch(() => {
            //         this.set("processing", false);
            //         alert("Unfortunately we were unable to create your account.");
            //     });
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
}

module.exports = LoginViewModel;


///////

const loginViewModel = new LoginViewModel();

exports.pageLoaded = function (args) {
    const page = args.object;
    page.bindingContext = loginViewModel;
}

///////
