const observableModule = require("tns-core-modules/data/observable");
const u = require('~/common/data/user');
const dialogsModule = require('tns-core-modules/ui/dialogs');
const LectuerersHttpRequests = require('~/modules/request/lectuerersHttpRequests');
const ConsultationsHttpRequests = require('~/modules/request/consultationsHttpRequests');

let pageData = observableModule.fromObject({
    data: {},
    subjects: [],
    chosenSubject: {
        id: null,
        name: 'Nie wybrano przedmiotu'
    }
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
           subjects.push(s);
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
        actions: pageData.subjects.map(s => s.name),
    }).then(function (result) {
        if (result === 'Anuluj'){
            return;
        }else
            chosenSubjectObj = pageData.subjects.find(s => s.name === result);
            pageData.set("chosenSubject", chosenSubjectObj);
    });
}

exports.signToConsulation = (args) => {
    const info = pageData.get("data");
    
    dialogsModule.confirm({
        title: 'Potwierdź',
        message: 'Czy na pewno chcesz się zapisać na tę konsultację?',
        okButtonText: 'Tak',
        cancelButtonText: 'Nie',
    }).then(result => {
            if(result) {
                ConsultationsHttpRequests.add(u.user.id,
                                              info.hour.teacher.id,
                                              info.hour.id,
                                              formatDateString(getClosestDate(info.hour.dayObject.id)),
                                              pageData.get('chosenSubject').id,
                                              'Oczekujący',
                                              u.user.token)
                .then(() => {
                    u.user.consultations.loaded = false;
                    goBack();
                })
                .catch(() => {
                    alert('Nie udało się zapisać na konsultacje :(');
                })
            }
    })
}

function formatDateString(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getClosestDate(weekDayNumber) {
    const today = new Date();
    let dayDiff;
    if (weekDayNumber > today.getDay()) {
        dayDiff = weekDayNumber - today.getDay();
    }
    else {
        dayDiff = 7 + weekDayNumber - today.getDay();
    }
    let closestDate = new Date();
    closestDate.setDate(today.getDate() + dayDiff);
    return closestDate;
}

function goBack() {
    page.frame.goBack();
}
