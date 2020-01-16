const observableModule = require('tns-core-modules/data/observable');
const frameModule = require('tns-core-modules/ui/frame');
const listViewModule = require('tns-core-modules/ui/list-view');
const dialogsModule = require('tns-core-modules/ui/dialogs');
const u = require('~/common/data/user');
const esubject = require('~/common/dataTypes/EmployeeSubject');

let testSubjects = [];
let testUserSubjects = [];

let page; 

let pageData = new observableModule.fromObject({
    withoutUserSubjects: [],
    userSubjects: []
});


exports.back = (args) => {
    const button = args.object;
    page = button.page;
    
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    page = args.object;
    if(!u.user.subjects.loaded) {
        sortByTitle(testSubjects);
        sortByTitle(testUserSubjects);
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
    let id = args.object.index;
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
    let id = args.object.index;
    let item = pageData.withoutUserSubjects.find(el => el.id === id);

    let userData = {
        id: u.user.id,
        name: u.user.name,
        surname: u.user.surname
    };
    let emp = item.employees.find(el => el.id === u.user.id);
    let indexEmp = item.employees.indexOf(emp);
    if (indexEmp === -1){
        item.employees.push(userData);
        item.height += 54;
    }

    moveItemFromListToOtherList(item, pageData.withoutUserSubjects, pageData.userSubjects);
    sortByTitle(pageData.userSubjects);
    sortByTitle(pageData.withoutUserSubjects);
    userListView.refresh();
    withoutUserListView.refresh();
}

exports.removeFromUserSubjects = (args) => {
    let id = parseInt(args.object.index, 10);
    let item = pageData.userSubjects.find(el => el.id === id);

    let emp = item.employees.find(el => el.id === u.user.id);
    let indexEmp = item.employees.indexOf(emp);
    if (indexEmp >= 0){
        item.employees.splice(indexEmp, 1);
        item.height -= 54;
    }

    moveItemFromListToOtherList(item, pageData.userSubjects, pageData.withoutUserSubjects);
    sortByTitle(pageData.userSubjects);
    sortByTitle(pageData.withoutUserSubjects);
    userListView.refresh();
    withoutUserListView.refresh();
}

function moveItemFromListToOtherList(item, from, to) {
    item.isOpen = false;
    let index = from.indexOf(item);
    to.push(item);
    from.splice(index, 1);
}

function sortByTitle(list){
    list.sort((a, b) => a.title.localeCompare(b.title))
}