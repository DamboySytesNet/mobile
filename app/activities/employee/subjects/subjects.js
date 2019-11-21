const observableModule = require('tns-core-modules/data/observable');
const frameModule = require('tns-core-modules/ui/frame');
const listViewModule = require('tns-core-modules/ui/list-view');
const dialogsModule = require('tns-core-modules/ui/dialogs');
const u = require('~/common/data/user');
const Subject = require('~/common/dataTypes/Subject');

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
            name: 'Kowalski',
            surname: 'Jan'
        },
        {
            id: 3,
            name: 'aaa',
            surname: 'Jabbbn'
        }
    ],
    },
    {
        id: 2,
        title: 'Analiza danych',
        semester: 3,
        employees: []
    },
    {
        id: 3,
        title: 'Matematyka dyskretna',
        semester: 2,
        employees: []
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
        employees: []
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
    list = page.getViewById('list');
    listView = page.getViewById('listView');
}

function loadEmployeeSubjects(subjects) {
    const tmp = [];
    for(let it of subjects) {
        tmp.push(new Subject.new(it.id, it.title, it.semester, it.employees));
    }
    return tmp;
}

// exports.edit = (args) => {

// }

// exports.delete = (args) => {
//     let id = parseInt(args.object.index, 10);

//     for (let i = 0; i < pageData.subjects.length; i++) {
//         if (pageData.subjects[i].id === id) {
//             pageData.subjects.splice(i, 1);
//             break;
//         }
//       }

//     listView.refresh();
// }