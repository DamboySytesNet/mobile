const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');


let pageData = new observableModule.fromObject({
    user: ''
});

exports.exit = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    const context = page.navigationContext;
    pageData.set('user', `${context.name} ${context.surname}`);
    page.bindingContext = pageData; 
}