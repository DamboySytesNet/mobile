const observableModule = require('tns-core-modules/data/observable');
const frameModule = require('tns-core-modules/ui/frame');
const listViewModule = require('tns-core-modules/ui/list-view');
const dialogsModule = require('tns-core-modules/ui/dialogs');
const EmployeeConsultation = require('~/common/dataTypes/EmployeeConsultation');
const u = require('~/common/data/user');
     
let pageData = new observableModule.fromObject({
    consultations: [],
    reasons: [
        'Dzisiaj mnie brzuch boli',
        'Mam ważniejsze rzeczy',
        '+ Dodaj własny powód'
    ]
});

let testConsultation = [
    {
        id: 1,
        student: 'Adrian Adriańsski',
        room: 243,
        date: new Date().toString(),
    },
    {
        id: 2,
        student: 'Damian Trisss',
        room: 211,
        date: new Date().toString(),        
    },
    {
        id: 66,
        student: 'Artur Yen',
        room: 453,
        date: new Date().toString(),   
    },
    {
        id: 22,
        student: 'Tomasz Dziobak',
        room: 111,
        date: new Date(2020, 5, 17, 2, 30).toString(),   
    },
    {
        id: 67,
        student: 'Artur Yesssss',
        room: 454,
        date: new Date(2020, 5, 17, 4, 30).toString(),   
    },
    {
        id: 4,
        student: 'Tomasz Chlebss',
        room: 099,
        date: new Date(2020, 10, 27, 8, 30).toString(),   
    }
]


exports.back = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    if(!u.user.consultations.loaded) {
        u.user.consultations.data = loadEmployeeConsultations(testConsultation);
        u.user.consultations.loaded = true;
    }
    pageData.set('consultations', groupByDayOfTheYear(u.user.consultations.data)); // insert here function returning cons from db
    page.bindingContext = pageData; 
    list = page.getViewById('list');
    listView = page.getViewById('listView');
}

exports.accept = (args) => {
    let id = parseInt(args.object.index, 10);
    for (let i of pageData.get('consultations')) {
        let tmp = i.cons.find(el => el.id === id);
        if (tmp) {
            tmp.state = 'accepted';
            tmp.excuse = null;
        }
   }
   listView.refresh();
}

exports.decline = (args) => {
    dialogsModule.confirm({
    title: 'Odrzuć',
    message: 'Czy na pewno chcesz odrzucić?',
    okButtonText: 'Potwierdź',
    cancelButtonText: 'Anuluj',
}).then(function (result) {
    if (result) {
        chooseReason(args);
    }
});
}

function chooseReason(args) {
    dialogsModule.action({
    message: 'Wybierz powód',
    cancelButtonText: 'Anuluj',
    actions: pageData.reasons
}).then(function (result) {
    if (result === '+ Dodaj własny powód'){
        addReason(args);
    }else if (result === 'Anuluj'){
        return;
    }else
        deleteConsultation(args, result);
});
}

function addReason(args) {
    dialogsModule.prompt('Dodaj powód', '').then(function (r) {
        if (r.result)
            deleteConsultation(args, r.text);
    }); 
}

function deleteConsultation(args, excuse) {
    let id = parseInt(args.object.index, 10);
    for (let i of pageData.get('consultations')) {
        let tmp = i.cons.find(el => el.id === id);
        if (tmp){
            tmp.state = 'declined';
            tmp.excuse = excuse;
        }
   }
   listView.refresh();
}

function loadEmployeeConsultations(cons) {
    const c = [];
    for(let con of cons) {
        c.push(new EmployeeConsultation.new(con.id, null, null, con.student, con.room, con.date, 'waiting', null));
    }
    return c;
}

function groupByDayOfTheYear(arr) {
    let uniqueDays = new Set();

    for (let a of arr) {
        uniqueDays.add(a.dayOfTheYear);
    }

    let grouped = [];
    
    for (let day of uniqueDays) {
        grouped.push({
            cons: arr.filter(c => { return c.dayOfTheYear == day}),
            day: day,
            height: 190 //height of 1 consulatation
        });
    }

    let today = new Date();
    for (let gr of grouped) {
        let conDay = gr.cons[0].date;
        let prefix = '';
        if (today.getYear() === conDay.getYear() && today.getMonth() === conDay.getMonth()) {
            if (today.getDate() === conDay.getDate()) {
                prefix = 'Dziś ';
            }
            else if(today.getDate() + 1 === conDay.getDate())
                prefix = 'Jutro ';
        }
        gr['date'] = `${prefix} ${conDay.getDate()}.${conDay.getMonth() + 1}.${conDay.getYear() + 1900}`;
        gr.cons.sort((a, b) => (a.date > b.date) ? 1 : -1);
    }

    grouped.sort((a, b) => (a.day > b.day) ? 1 : -1);

    for (let i of grouped) {
        i.height *= i.cons.length;
    }

    return grouped;
}
