const observableModule = require("tns-core-modules/data/observable");
const listViewModule = require("tns-core-modules/ui/list-view");
const Consultation = require("~/common/dataTypes/Consultation");

let pageData = new observableModule.fromObject({
    user: '',
    consultations: []
})

exports.backToCockpit = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.onPageLoaded = (args) => {
    let page = args.object;
    const context = page.navigationContext;
    pageData.set('consultations', loadConsultations(context.consultations));

    groupByDayOfTheYear(pageData.consultations);

    page.bindingContext = pageData;
}

function loadConsultations(cons) {
    const c = []
    for(con of cons) {
        c.push(new Consultation.Cons(con.id, con.subject, con.teacher, con.room, con.date, null, null));
    }

    return c;
}

function groupByDayOfTheYear(arr) {
    let uniqueDays = new Set();

    for (a of arr) {
        uniqueDays.add(a.dayOfTheYear);
    }

    let grouped = {};
    
    for (day of uniqueDays) {
        grouped[day] = arr.filter(c => { return c.dayOfTheYear == day});
    }

    return grouped;
}


var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
