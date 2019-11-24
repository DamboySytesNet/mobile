const observableModule = require("tns-core-modules/data/observable");
const listViewModule = require("tns-core-modules/ui/list-view");
const frameModule = require('tns-core-modules/ui/frame');
const Consultation = require("~/common/dataTypes/Consultation");
const u = require('~/common/data/user');
// only for test purposes
const test = require('~/common/data/testConsultations');

let pageData = new observableModule.fromObject({
    consultations: []
})

exports.exit = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.goToDetails = (args) => {
    const page = args.object.page;
    const moduleName = 'activities/student/details/details';
    const id = args.object.index;
    // alert(args.object.index);
    const navigationEntry = {
        moduleName: moduleName,
        context: {
            consultationId: id
        }
    }

    page.frame.navigate(navigationEntry);
} 

exports.onPageLoaded = (args) => {
    const page = args.object;

    // load only when visit activity for the first time
    if(!u.user.consultations.loaded) {
        u.user.consultations.data = loadConsultations();
        u.user.consultations.loaded = true;
    }

    pageData.set('consultations', groupByDayOfTheYear(u.user.consultations.data));
    // alert(JSON.stringify(pageData.consultations));
    page.bindingContext = pageData;
}

function loadConsultations() {
    let consultationObjectsList = []
    for(let con of test.testConsultations) {
        consultationObjectsList.push(new Consultation.Cons(con.id, con.subject, con.teacher, con.room, con.date, 'oczekujący', null));
    }
    return consultationObjectsList;
}

function groupByDayOfTheYear(consultations) {
    let uniqueDays = new Set();

    for (let con of consultations) {
        uniqueDays.add(con.dayOfTheYear);
    }

    let grouped = [];
    
    for (let day of uniqueDays) {
        grouped.push({
            cons: consultations.filter(c => c.dayOfTheYear === day),
            day: day,
        });
    }

    let today = new Date();
    for (let group of grouped) {
        let conDay = group.cons[0].date;
        let prefix = "";
        if (today.getYear() === conDay.getYear() && today.getMonth() === conDay.getMonth()) {
            if (today.getDate() === conDay.getDate()) {
                prefix = "Dziś";
            }
            else if(today.getDate() + 1 === conDay.getDate()) {
                prefix = "Jutro";
            }
        }
        group['date'] = `${prefix} (${conDay.getDate()}.${conDay.getMonth() + 1}.${conDay.getYear() + 1900})`;
        group.cons.sort((a, b) => (a.date > b.date) ? 1 : -1);
    }

    grouped.sort((a, b) => (a.day > b.day) ? 1 : -1);

    return grouped;
}
