const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');
const listViewModule = require("tns-core-modules/ui/list-view");
const dialogsModule = require("tns-core-modules/ui/dialogs");
const EmployeeConsultation = require("~/common/dataTypes/EmployeeConsultation")

// new Date(2019, 11, 12, 10, 30, 0).getFullYear() + "-" + (new Date(2019, 10, 30, 10, 30, 0).getMonth() + 1) + "-" + new Date(2019, 10, 30, 10, 30, 0).getDate() + " " + new Date(2019, 10, 30, 10, 30, 0).getHours() + ":" + new Date(2019, 10, 30, 10, 30, 0).getMinutes(),
        
let pageData = new observableModule.fromObject({
    user: '',
    consultations: [],
    reasons: [
        "Dzisiaj mnie brzuch boli",
        "Mam ważniejsze rzeczy",
        "+ Dodaj własny powód"
    ]
});

exports.back = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

let testConsultation = [
    {
        id: 1,
        student: 'Adrian Adriański',
        room: 243,
        date: new Date(2019, 10, 12, 10, 30).toString(),
    },
    {
        id: 2,
        student: 'Damian Trisss',
        room: 211,
        date: new Date(2019, 10, 12, 9, 30).toString(),        
    },
    {
        id: 66,
        student: 'Artur Yen',
        room: 453,
        date: new Date(2020, 5, 17, 7, 30).toString(),   
    },
    {
        id: 4,
        student: 'Tomasz Chlebss',
        room: 099,
        date: new Date(2020, 10, 27, 8, 30).toString(),   
    }
]

exports.pageLoaded = (args) => {
    let page = args.object;
    const context = page.navigationContext;
    pageData.set('user', `${context.user}`);
    pageData.set('consultations', groupByDayOfTheYear(loadEmployeeConsultations(testConsultation))); // insert here function returning cons from db
    
    page.bindingContext = pageData; 
    listView = page.getViewById("listView");

}
exports.accept = (args) => {
    alert("Zaakceptowano");
}


exports.decline = (args) => {
    dialogsModule.confirm({
    title: "Odrzuć",
    message: "Czy na pewno chcesz odrzucić?",
    okButtonText: "Potwierdź",
    cancelButtonText: "Anuluj",
}).then(function (result) {
    if (result){
        chooseReason();
    }
});
}
function chooseReason(){
    dialogsModule.action({
    message: "Wybierz powód",
    cancelButtonText: "Anuluj",
    actions: pageData.reasons
}).then(function (result) {
    if (result == "+ Dodaj własny powód"){
        addReason();
    }else if (result != "Anuluj"){
        console.log(result);
        deleteConsultation();
    }else{
        console.log(result);
    }
});
}
function addReason(){
    dialogsModule.prompt("Dodaj powód", "tutaj wpisz własny").then(function (r) {
        console.log("Dialog result: " + r.result + ", text: " + r.text);
        if (r.result == true)
            deleteConsultation();
    }); 
}

function deleteConsultation(){
    pageData.consultations.splice(pageData.index , 1);
    listView.refresh();
}

function loadEmployeeConsultations(cons) {
    const c = []
    for(con of cons) {
        c.push(new EmployeeConsultation.new(con.id, null, null, con.student, con.room, con.date, null, null));
    }

    return c;
}
function groupByDayOfTheYear(arr) {
    let uniqueDays = new Set();

    for (a of arr) {
        uniqueDays.add(a.dayOfTheYear);
    }

    let grouped = [];
    
    for (day of uniqueDays) {
        grouped.push({
            cons: arr.filter(c => { return c.dayOfTheYear == day}),
            day: day,
        });
    }

    let today = new Date();
    for (gr of grouped) {
        let conDay = gr.cons[0].date;
        let prefix = "";
        if (today.getYear() === conDay.getYear() && today.getMonth() === conDay.getMonth()) {
            if (today.getDate() === conDay.getDate()) {
                prefix = "Dziś";
            }
            else if(today.getDate() + 1 === conDay.getDate()) {
                prefix = "Jutro";
            }
        }
        gr['date'] = `${prefix} (${conDay.getDate()}.${conDay.getMonth() + 1}.${conDay.getYear() + 1900})`;
        gr.cons.sort((a, b) => (a.date > b.date) ? 1 : -1);
    }

    grouped.sort((a, b) => (a.day > b.day) ? 1 : -1);

    return grouped;
}