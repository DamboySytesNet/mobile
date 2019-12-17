const observableModule = require("tns-core-modules/data/observable");
const test = require('~/common/data/testTeachers');



let pageData = new observableModule.fromObject({
    all: [],
    consultations: [],
})

let page;

exports.onPageLoaded = (args) => {
    page = args.object;

    const teachers = test.testTeachers;
    let consultationList = [];

    for (let t of teachers) {
        let consultations = t.consultationTimes;
        for (let c of consultations) {
            c.teacher = t.name;
        }
        consultationList.push(...consultations);
    }
    // alert(JSON.stringify(consultationList));

    pageData.set('all', consultationList);
    pageData.set('consultations', pageData.get('all'));
    page.bindingContext = pageData;
}

exports.exit = (args) => {
    page.frame.goBack();
}

exports.goToTeacherDetails = (args) => {
    const moduleName = 'activities/student/search/teacherDetails/teacherDetails';
    const hour = pageData.get("consultations").find(el => el.id == args.object.hourId);
    let emp = null;
    for (let t of test.testTeachers) {
       for (let ct of t.consultationTimes) {
           if (ct.id === hour.id) {
               emp = t;
               break;
           }
       }
    }

    const navigationEntry = {
        moduleName: moduleName,
        context: {
            data: hour,
            employee: emp
        }
    }
    page.frame.navigate(navigationEntry);
}

exports.onTextChange = (args) => {
    const pattern = args.object.text;

    if (pattern !== null && pattern !== '' && pattern !== ' ') {
        const refreshed = pageData.get('all').filter(e => e.teacher.includes(pattern))
        pageData.set('consultations', refreshed);
    } 
    else {
        pageData.set('consultations', pageData.get('all'));
    }
}