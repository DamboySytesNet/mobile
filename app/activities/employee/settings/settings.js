const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');
let page;

let myHours = [
    {
        from: '8:00',
        to: '8:01',
        day: 'Poniedziałek',
        room: '202',
        edit() {

        },

        remove() {
            
        }
    },
    {
        from: '8:02',
        to: '8:03',
        day: 'Wtorek',
        room: '204',
        edit() {

        },

        remove() {
            
        }
    }
];

let pageData = new observableModule.fromObject({
    user: '',
    room: '213',
    myHours: myHours
});

exports.exit = (args) => {
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    page = args.object;
    const context = page.navigationContext;
    pageData.set('user', `${context.name} ${context.surname}`);
    page.bindingContext = pageData; 
}