const observableModule = require("tns-core-modules/data/observable");
const u = require('~/common/data/user');
const Consultation = require("~/common/dataTypes/Consultation");
const dialogsModule = require('tns-core-modules/ui/dialogs');
const LectuerersHttpRequests = require('~/modules/request/lectuerersHttpRequests');

let pageData = observableModule.fromObject({
    data: {},
    subjects: [],
    chosenSubject: "Nie wybrano przedmiotu"
});

let page = null;

exports.onPageLoaded = (args) => {
    page = args.object;
    const consultationInfo = page.navigationContext.data;
    const lectuererId = page.navigationContext.id;
    let subjects = [];
    LectuerersHttpRequests.getLectuererSubjects(lectuererId, u.user.token)
    .then(res => {
       for (let s of res) {
           subjects.push(s.name);
       }
       pageData.set('subjects', subjects); 
    })

    const info = {
        hour: consultationInfo,
    }
    pageData.set("data", info);
    pageData.set("chosenSubject", "Nie wybrano przedmiotu");

    page.bindingContext = pageData;
}

exports.exit = (args) => {
    goBack();
}

exports.chooseSubject = args => {
    dialogsModule.action({
        message: 'Wybierz przedmiot',
        cancelButtonText: 'Anuluj',
        actions: pageData.subjects
    }).then(function (result) {
        if (result === 'Anuluj'){
            return;
        }else
            pageData.set("chosenSubject", result);
    });
}

exports.signToConsulation = (args) => {
    const info = pageData.get("data");
    const consultation = new Consultation.Cons(123, pageData.get("chosenSubject"), info.employee.name, info.employee.room, new Date().toString(), "Oczekujący");
    dialogsModule.confirm({
        title: 'Potwierdź',
        message: 'Czy na pewno chcesz się zapisać na tę konsultację?',
        okButtonText: 'Tak',
        cancelButtonText: 'Nie',
    }).then(result => {
            if(result) {
                u.user.consultations.data.push(consultation);
                goBack();
            }
    })
}

function goBack() {
    page.frame.goBack();
}
