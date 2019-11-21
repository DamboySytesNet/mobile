const observableModule = require('tns-core-modules/data/observable');
const frameModule = require('tns-core-modules/ui/frame');
const listViewModule = require('tns-core-modules/ui/list-view');
const dialogsModule = require('tns-core-modules/ui/dialogs');
const u = require('~/common/data/user');
const esubject = require('~/common/dataTypes/EmployeeSubject');

let pageData = new observableModule.fromObject({
    subjects: []
});

let testSubjects = [
    {
        id: 1,
        title: 'Podstawy programowania',
        semester: 1,
        employees: [{
            id: 2,
            name: 'Jan',
            surname: 'Kowalski'
        },
        {
            id: 3,
            name: 'Tomasz',
            surname: 'Grela'
        }
    ],
    },
    {
        id: 2,
        title: 'Analiza danych',
        semester: 3,
        employees: [
        {
            id: 3,
            name: 'Andrzej',
            surname: 'Andrzejewski'
        }]
    },
    {
        id: 3,
        title: 'Matematyka dyskretna',
        semester: 2,
        employees: [{
            id: 2,
            name: 'Jan',
            surname: 'Kowalski'
        },
        {
            id: 3,
            name: 'Tomasz',
            surname: 'Grela'
        },
        {
            id: 5,
            name: 'Ewa',
            surname: 'Jabłoń'
        }]
    },
    {
        id: 4,
        title: 'Fizyka 1',
        semester: 1,
        employees: []
    },
    {
        id: 5,
        title: 'Fizyka 2',
        semester: 2,
        employees: [        {
            id: 5,
            name: 'Ewa',
            surname: 'Jabłoń'
        }]
    },
]

exports.back = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    if(!u.user.subjects.loaded) {
        u.user.subjects.data = loadEmployeeSubjects(testSubjects);
        u.user.subjects.loaded = true;
    }
    pageData.set('subjects', u.user.subjects.data);
    page.bindingContext = pageData;
    listView = page.getViewById('listView');
}

function loadEmployeeSubjects(subjects) {
    const tmp = [];
    for(let it of subjects) {
        tmp.push(new esubject.new(it.id, it.title, it.semester, it.employees, false, 54 * it.employees.length));
    }
    return tmp;
}

exports.changeIsOpen = (args) => {
    let id = parseInt(args.object.index, 10);
    let tmp = pageData.subjects.find(el => el.id === id);
    if (tmp) tmp.isOpen = !tmp.isOpen;
    listView.refresh();
}