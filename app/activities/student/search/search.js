const observableModule = require("tns-core-modules/data/observable");
const TeachersHttpRequest = require('~/modules/request/teachersHttpRequests');
const test = require('~/common/data/testTeachers');
const u = require('~/common/data/user');
const Hours = require("~/common/dataTypes/Hours");
const AppData = require('~/common/data/AppData')



let pageData = new observableModule.fromObject({
    all: [],
    consultations: [],
})

let page;

exports.onPageLoaded = (args) => {
    page = args.object;

    if (!AppData.hours.loaded) {
        // load from database
        AppData.hours.loaded = true;
        TeachersHttpRequest.get(u.user.token)
        .then( res => {
            for (let t of res) {
                let hourData = new Hours.new(t.id, t.timeFrom, t.timeTo, t.day, t.room);
                hourData.teacher = t.teacher;
                AppData.hours.data.push(hourData);
            }
            pageData.set('all', AppData.hours.data);
            pageData.set('consultations', pageData.get('all'));
            page.bindingContext = pageData;    
        })
    }
    else{
        pageData.set('all', AppData.hours.data);
        pageData.set('consultations', pageData.get('all'));
        page.bindingContext = pageData;
    }
    
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