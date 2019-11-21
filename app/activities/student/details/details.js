const observableModule = require("tns-core-modules/data/observable");
const u = require('~/common/data/user');

let pageData = new observableModule.fromObject({
    consultation: {}
})

exports.onPageLoaded = (args) => {
    let page = args.object;
    const context = page.navigationContext;
    const chosenConsultationId = context.consultationId
    pageData.set('id', chosenConsultationId);

    const c = u.user.consultations.data.find(element => element.id = context.consultationId);
    // alert(JSON.stringify(context));
    pageData.set('consultation', c);
    page.bindingContext = pageData;
}