const observableModule = require("tns-core-modules/data/observable");

let pageData = new observableModule.fromObject({
    user: '',
    consultations: []
})

exports.backToCockpit = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.onPageLoaded = (args) => {
    let page = args.object;
    const context = page.navigationContext;

    // pageData.set('user', `${context.user}`);
    pageData.set('consultations', context.consultations);

    alert(pageData.consultations.subject);
}
