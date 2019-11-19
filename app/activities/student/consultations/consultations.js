const observableModule = require("tns-core-modules/data/observable");
const listViewModule = require("tns-core-modules/ui/list-view");
const Consultation = require("~/common/dataTypes/Consultation");

let pageData = new observableModule.fromObject({
    user: '',
    consultations: []
})

exports.exit = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.onPageLoaded = (args) => {
    let page = args.object;
    const context = page.navigationContext;
    pageData.set('consultations', groupByDayOfTheYear(loadConsultations(context.consultations)));
    // alert(JSON.stringify(pageData.consultations));
    page.bindingContext = pageData;
}

function loadConsultations(consultations) {
    const consultationObjectsList = []
    for(let con of consultations) {
        consultationObjectsList.push(new Consultation.Cons(con.id, con.subject, con.teacher, con.room, con.date, null, null));
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
