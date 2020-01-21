const observableModule = require("tns-core-modules/data/observable");
const Consultation = require("~/common/dataTypes/Consultation");
const u = require('~/common/data/user');
const ConsultationsHttpRequest = require('~/modules/request/consultationsHttpRequest');

let pageData = new observableModule.fromObject({
    consultations: [],
    loading: false
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
    const navigationEntry = {
        moduleName: moduleName,
        context: {
            consultationId: id
        }
    }

    page.frame.navigate(navigationEntry);
}

exports.goToSearch = (args) => {
    const page = args.object.page;
    const moduleName = 'activities/student/search/search';
    const navigationEntry = {
        moduleName: moduleName
    }

    page.frame.navigate(navigationEntry);
}

exports.onPageLoaded = (args) => {
    const page = args.object;

    pageData.set('loading', true);
    // load only when visit activity for the first time
    if (!u.user.consultations.loaded) {

        ConsultationsHttpRequest.get(u.user.id, u.user.token)
            .then(res => {
                u.user.consultations.data = [];
                for (const con of res) {
                    u.user.consultations.data.push(new Consultation.Cons(
                        con.id,
                        con.subject,
                        con.teacherId,
                        con.teacher,
                        con.room,
                        `${con.date} ${con.timeFrom}`,
                        con.state,
                        con.excuse));
                }
                pageData.set('consultations', groupByDayOfTheYear(u.user.consultations.data));
                page.bindingContext = pageData;
                u.user.consultations.loaded = true;
            }).catch(() => {
                alert('Nie udało sie pobrać konsultacji!');
                page.frame.goBack();
            });
    } else {
        pageData.set('consultations', groupByDayOfTheYear(u.user.consultations.data));
        page.bindingContext = pageData;
    }
    pageData.set('loading', false);
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
            height: 52
        });
    }

    let today = new Date();
    for (let group of grouped) {
        let conDay = group.cons[0].date;
        const dateStr = group.cons[0].dateStr;
        let prefix = "";
        if (today.getYear() === conDay.getYear() && today.getMonth() === conDay.getMonth()) {
            if (today.getDate() === conDay.getDate()) {
                prefix = "Dziś";
            } else if (today.getDate() + 1 === conDay.getDate()) {
                prefix = "Jutro";
            }
        }

        group['date'] = `${prefix} (${conDay.getDate()}.${conDay.getMonth() + 1}.${conDay.getYear() + 1900})`;
        group.cons.sort((a, b) => (a.date > b.date) ? 1 : -1);
        group['dateStr'] = dateStr;
    }

    grouped.sort((a, b) => (a.day > b.day) ? 1 : -1);
    for (let i of grouped) {
        i.height *= i.cons.length;
    }
    return grouped;
}
