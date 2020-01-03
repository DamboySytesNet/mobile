const observableModule = require("tns-core-modules/data/observable");
const u = require('~/common/data/user');
const Consultation = require("~/common/dataTypes/Consultation");
const dialogsModule = require('tns-core-modules/ui/dialogs');
const LectuerersHttpRequests = require('~/modules/request/lectuerersHttpRequests');
const ConsultationsHttpRequests = require('~/modules/request/consultationsHttpRequests');

let pageData = observableModule.fromObject({
    data: {},
    subjects: [],
    chosenSubject: "Nie wybrano przedmiotu"
});

let page = null;

exports.onPageLoaded = (args) => {
    page = args.object;
    const consultationInfo = page.navigationContext.data;
    
    const lectuererId = consultationInfo.teacher.id;
    const subjects = [];
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
    // TODO ustal date
    const consultation = new Consultation.Cons(123,
                                               pageData.get("chosenSubject"),
                                               info.hour.teacher.name, 
                                               info.hour.room, 
                                               new Date().toString(), 
                                               "Oczekujący");
    dialogsModule.confirm({
        title: 'Potwierdź',
        message: 'Czy na pewno chcesz się zapisać na tę konsultację?',
        okButtonText: 'Tak',
        cancelButtonText: 'Nie',
    }).then(result => {
            if(result) {
                // TODO get proper date
                // TODO get subject id
                ConsultationsHttpRequests.add(u.user.id,
                                              info.hour.teacher.id,
                                              info.hour.id,
                                              '2020-01-03',
                                              1,
                                              'Oczekujący',
                                              u.user.token)
                .then(() => {
                    u.user.consultations.data.push(consultation);
                    goBack();
                })
            }
    })
}

function goBack() {
    page.frame.goBack();
}
