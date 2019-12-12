const observableModule = require('tns-core-modules/data/observable');
const frameModule = require('tns-core-modules/ui/frame');
const listViewModule = require('tns-core-modules/ui/list-view');
const dialogsModule = require('tns-core-modules/ui/dialogs');
const u = require('~/common/data/user');
const esubject = require('~/common/dataTypes/EmployeeSubject');

let pageData = new observableModule.fromObject({
    withoutUserSubjects: [],
    userSubjects: []
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

let testUserSubjects = [    
{
    id: 11,
    title: 'Programowanie obiektowe',
    semester: 1,
    employees: [{
        id: 2,
        name: 'Jan',
        surname: 'Kowalski'
    },
    {
        id: u.user.id,
        name: u.user.name,
        surname: u.user.surname
    },
    {
        id: 3,
        name: 'Tomasz',
        surname: 'Grela'
    }
],
},
{
    id: 12,
    title: 'Chmury',
    semester: 3,
    employees: [
    {
        id: 3,
        name: 'Andrzej',
        surname: 'Andrzejewski'
    },
    {
        id: u.user.id,
        name: u.user.name,
        surname: u.user.surname
    },
]
},
{
    id: 13,
    title: 'Systemy wbudowane',
    semester: 2,
    employees: [
    {
        id: u.user.id,
        name: u.user.name,
        surname: u.user.surname
    },    
    {
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
}]

exports.back = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    if(!u.user.subjects.loaded) {
        u.user.subjects.data.withoutUserSubjects = loadEmployeeSubjects(testSubjects);
        u.user.subjects.data.userSubjects = loadEmployeeSubjects(testUserSubjects);
        u.user.subjects.loaded = true;
    }
    pageData.set('withoutUserSubjects', u.user.subjects.data.withoutUserSubjects);
    pageData.set('userSubjects', u.user.subjects.data.userSubjects)
    page.bindingContext = pageData;
    
    withoutUserListView = page.getViewById('withoutUserListView');
    userListView = page.getViewById('userListView');
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
    let tmp;
    if (args.object.id === 'withoutUserSubjectsDock') 
        tmp = pageData.withoutUserSubjects.find(el => el.id === id);
    else if (args.object.id === 'userSubjectsDock')
        tmp = pageData.userSubjects.find(el => el.id === id);
    if (tmp) tmp.isOpen = !tmp.isOpen;
    userListView.refresh()
    withoutUserListView.refresh();
}

exports.addToUserSubjects = (args) => {
    let id = parseInt(args.object.index, 10);
    let tmp = pageData.withoutUserSubjects.find(el => el.id === id);
    tmp.isOpen = false;
    let index = pageData.withoutUserSubjects.indexOf(tmp);
    pageData.userSubjects.push(tmp);
    pageData.withoutUserSubjects.splice(index, 1);

    userListView.refresh()
    withoutUserListView.refresh();
}

exports.removeFromUserSubjects = (args) => {
    let id = parseInt(args.object.index, 10);
    let tmp = pageData.userSubjects.find(el => el.id === id);
    tmp.isOpen = false;
    let index = pageData.userSubjects.indexOf(tmp);
    pageData.withoutUserSubjects.push(tmp);
    pageData.userSubjects.splice(index, 1);

    userListView.refresh()
    withoutUserListView.refresh();
}