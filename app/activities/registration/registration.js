const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require('tns-core-modules/ui/dialogs');
let page;

let pageData = new observableModule.fromObject({
    name: '',
    surname: '',
    email: '',
    password: ''
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