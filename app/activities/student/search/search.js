const observableModule = require("tns-core-modules/data/observable");
const test = require('~/common/data/testTeachers');



let pageData = new observableModule.fromObject({
    consultations: []
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

    alert(JSON.stringify(consultationList));

    pageData.set('consultations', consultationList);
    page.bindingContext = pageData;
}

exports.exit = (args) => {
    page.frame.goBack();
}

exports.goToTeacherDetails = (args) => {
    const moduleName = 'activities/student/search/teacherDetails/teacherDetails';
    const hour = test.testTeachers.find(teacher => teacher.id === args.object.hourId);

    const navigationEntry = {
        moduleName: moduleName,
        context: {
            data: hour
        }
    }
    page.frame.navigate(navigationEntry);
}