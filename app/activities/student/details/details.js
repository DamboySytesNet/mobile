const observableModule = require("tns-core-modules/data/observable");
const u = require('~/common/data/user');

let pageData = new observableModule.fromObject({
    id: -1,
    consultation: {}
})

let page;

exports.onPageLoaded = (args) => {
    page = args.object;
    const context = page.navigationContext;
    const chosenConsultationId = context.consultationId
    pageData.set('id', chosenConsultationId);

    const c = u.user.consultations.data.find(element => element.id === chosenConsultationId);
    // alert(JSON.stringify(context));
    pageData.set('consultation', c);
    page.bindingContext = pageData;
}

exports.exit = (args) => {
    page.frame.goBack();
}