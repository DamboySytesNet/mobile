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
        desc: 'blavlbalal'
    },
    {
        id: 2,
        title: 'Analiza danych',
        desc: 'blavlbalal fasfa faf'
    },
    {
        id: 3,
        title: 'Matematyka dyskretna',
        desc: 'blavlbalal'
    },
    {
        id: 4,
        title: 'Fizyka 1',
        desc: 'blavlbalal fasfa faf'
    },
]

exports.back = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    alert(u.user.subjects.loaded);
    // if(!u.user.subjects.loaded) {
    //     u.user.subjects.data = loadEmployeeSubjects(testSubjects);
    //     u.user.subjects.loaded = true;
    // }
    // pageData.set('subjects', u.user.subjects.data);
    // page.bindingContext = pageData; 
    // list = page.getViewById('list');
    // listView = page.getViewById('listView');
}

function loadEmployeeSubjects(subjects) {
    const tmp = [];
    for(let it of subjects) {
        tmp.push(new Subject.new(it.id, it.title, it.desc));
    }
    return tmp;
}