const observableModule = require("tns-core-modules/data/observable");

let testConsultation = [
    {
        id: 1,
        subject: 'Podstawy programowania',
        teacher: 'Gabriela jakaśtam',
        room: 243,
        date: new Date(2019, 10, 30, 10, 30),
    },
    {
        id: 2,
        subject: 'Podstawy sieci komputerowych',
        teacher: 'Dziuba',
        room: 270,
        date: new Date(2019, 10, 25, 10, 30)
    }
];

let student = {
    id: 123456,
    name: 'testName',
    surname: 'testSurname',
    consultations: testConsultation,
}

var pageData = new observableModule.fromObject({
    message: student.name + " " + student.surname
});

exports.pageLoaded = (args) => {
    let page = args.object;
    page.bindingContext = pageData;
}