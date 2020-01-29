const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require('tns-core-modules/ui/dialogs');
const RegisterRequest = require('~/modules/request/registerRequest');
let page;

let pageData = new observableModule.fromObject({
    name: 'Adrian',
    surname: '',
    email: '',
    password: '',
    repeatedPassword: '',
    loading: false
})

exports.back = args => {
    const button = args.object;
    page = button.page;
    page.frame.goBack();
};

exports.pageLoaded = args => {
    page = args.object;
    page.bindingContext = pageData;
};

exports.register = () => {
    if (validateEmail(pageData.get('email')) && 
        pageData.get('name') !== '' &&
        pageData.get('surname') !== '' &&
        pageData.get('password') === pageData.get('repeatedPassword')) {
            pageData.set('loading', true);
            RegisterRequest.add(pageData.get('email'), pageData.get('name'),
                                pageData.get('surname'), pageData.get('password'))
                                .then(() => {
                                    pageData.set('loading', false);
                                    alert('Dziękujemy. Proszę potwierdzić rejestracje na mailu.');
                                    page.frame.goBack();
                                })
                                .catch(() => {
                                    alert('Nie udało się zarejestrować.');
                                })
        }
        else {
            alert('Nie udało się zarejestrować.');
        }
        
}

/** Validate email */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}