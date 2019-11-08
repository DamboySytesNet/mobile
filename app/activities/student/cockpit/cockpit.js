const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');

const u = require('~/common/data/user');

let testConsultation = [
    {
        id: 1,
        subject: 'Podstawy programowania',
        teacher: 'Gabriela Narutowicz',
        room: 243,
        date: new Date(2019, 10, 30, 10, 30).toString(),
    },
    {
        id: 2,
        subject: 'Podstawy sieci komputerowych',
        teacher: 'Bł Dziuba',
        room: 270,
        date: new Date(2019, 10, 25, 10, 30).toString(),
    },
    {
        id: 3,
        subject: 'Programowanie obiektowe',
        teacher: 'Marcin Kwapisz',
        room: 244,
        date: new Date(2019, 10, 25, 13, 30).toString(),
    },
    {
        id: 4,
        subject: 'Podstawy grafiki komputerowej',
        teacher: 'Napierdalalski',
        room: 270,
        date: new Date(2019, 10, 26, 8, 30).toString(),
        
    }
];

let student = {
    id: 123456,
    name: 'testName',
    surname: 'testSurname',
    consultations: testConsultation,
}


let pageData = new observableModule.fromObject({
    user: '',

    goToStudentConsultations() {
        let moduleName = 'activities/student/consultations/consultations';
        const navigationEntry = {
            moduleName: moduleName,
            context: {
                consultations: testConsultation
            }
        };
        // alert("alert!");
        frameModule.topmost().navigate(navigationEntry);
    }

});

exports.exit = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    pageData.set('user', `${u.user.name} ${u.user.surname}`);
    page.bindingContext = pageData;
}