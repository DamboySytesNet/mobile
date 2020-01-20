const observableModule = require("tns-core-modules/data/observable");
const TeachersHttpRequest = require('~/modules/request/teachersHttpRequests');
const u = require('~/common/data/user');
const Hours = require("~/common/dataTypes/Hours");
const AppData = require('~/common/data/AppData');



let pageData = new observableModule.fromObject({
    all: [],
    consultations: [],
    loading: true
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
                hourData.teacher = {
                    id: t.lecturerId,
                    name: t.teacher
                }
                AppData.hours.data.push(hourData);
            }
            pageData.set('all', AppData.hours.data);
            pageData.set('loading', false);
            pageData.set('consultations', pageData.get('all'));
            page.bindingContext = pageData;    
        })
    }
    else{
        pageData.set('all', AppData.hours.data);
        pageData.set('loading', false);
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

    const navigationEntry = {
        moduleName: moduleName,
        context: {
            data: hour,
        }
    }
    page.frame.navigate(navigationEntry);
}

exports.submit = (args) => {
    const pattern = args.object.text;
    const refreshed = pageData.get('all').filter(e => e.teacher.name.toUpperCase().includes(pattern.toUpperCase()))
    pageData.set('consultations', refreshed);
}

exports.clear = () => {
    pageData.set('consultations', pageData.get('all'));
}