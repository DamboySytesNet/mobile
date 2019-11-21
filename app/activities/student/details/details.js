const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require('tns-core-modules/ui/dialogs');
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
    goBack();
}

exports.deleteConsultation = (args) => {
    dialogsModule.confirm({
        title: 'Wypisz się',
        message: 'Czy na pewno chcesz wypisać się z tej konsultacji?',
        okButtonText: 'Potwierdź',
        cancelButtonText: 'Anuluj',
    }).then(function (result) {
        if (result) {
            u.user.consultations.data = u.user.consultations.data.filter(cons => cons.id !== pageData.get('id'));
            goBack();
        }
    });

}

function goBack() {
    page.frame.goBack();
}