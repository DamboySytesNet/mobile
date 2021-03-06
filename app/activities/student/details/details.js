const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require('tns-core-modules/ui/dialogs');
const u = require('~/common/data/user');
const ConsultationsHttpRequest = require('~/modules/request/consultationsHttpRequest');

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
            const consultationId = pageData.get('id');
            const employee_id = u.user.consultations.data.find(element => element.id === consultationId).teacherId;

            ConsultationsHttpRequest.delete(pageData.get('id'), employee_id, u.user.token)
                .then(() => {
                    u.user.consultations.loaded = false;
                    goBack();
                })
                .catch(() => {
                    alert('Nie udało się usunąć konsultacji :(');
                })
            // u.user.consultations.data = u.user.consultations.data.filter(cons => cons.id !== pageData.get('id'));
        }
    });

}

function goBack() {
    page.frame.goBack();
}
