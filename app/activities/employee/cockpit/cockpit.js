const observableModule = require("tns-core-modules/data/observable");

let testConsultation = [
    {
        id: 1,
        subject: 'Podstawy programowania',
        teacher: 'Gabriela Narutowicz',
        room: 243,
        date: new Date(2019, 10, 30, 10, 30),
    },
    {
        id: 2,
        subject: 'Podstawy sieci komputerowych',
        teacher: 'Bł Dziuba',
        room: 270,
        date: new Date(2019, 10, 25, 10, 30)
    }
];

let employee = {
    id: 123456,
    name: 'testName',
    surname: 'testSurname',
    consultations: testConsultation,
}

let pageData = new observableModule.fromObject({
    user: ''
});

exports.exit = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    const context = page.navigationContext;

    pageData.set('user', `${context.name} ${context.surname}`);
    page.bindingContext = pageData;
}