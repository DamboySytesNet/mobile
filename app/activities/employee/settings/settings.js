const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');
const Hours = require("~/common/dataTypes/EmployeeHours");
let page;

const u = require('~/common/data/user');

let myHours = [
    {
        id: 1,
        from: '8:00',
        to: '8:01',
        day: 'poniedziałek',
        room: '202'
    },
    {
        id: 2,
        from: '8:02',
        to: '8:03',
        day: 'wtorek',
        room: '204'
    }
];

let pageData = new observableModule.fromObject({
    user: '',
    room: '213',
    loading: false,
    hours: []
});

exports.exit = (args) => {
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    page = args.object;
    pageData.set('user', `${u.user.name} ${u.user.surname}`);

    for (let hour of myHours)
        u.user.hours.push(new Hours.new(hour.id, hour.from, hour.to, hour.day, hour.room));
    
    pageData.set('hours', u.user.hours);

    // const listView = page.getViewById('main-list');
    // listView.refresh();

    page.bindingContext = pageData; 
}