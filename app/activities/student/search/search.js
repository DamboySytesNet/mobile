const observableModule = require("tns-core-modules/data/observable");
const test = require('~/common/data/testTeachers');



let pageData = new observableModule.fromObject({
    teachers: []
})

let page;

exports.onPageLoaded = (args) => {
    page = args.object;

    pageData.set('teachers', test.testTeachers);
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