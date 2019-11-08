const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');
let page;

const u = require('~/common/data/user');
const HoursGetter = require('~/modules/get/hours');
const Hours = require("~/common/dataTypes/EmployeeHours");

let pageData = new observableModule.fromObject({
    user: '',
    room: '213',
    hours: [],
    loading: true
});

exports.exit = (args) => {
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    page = args.object;
    pageData.set('user', `${u.user.name} ${u.user.surname}`);

    HoursGetter.get(u.user.id)
        .then((res) => {
            for (let hour of res)
                u.user.hours.push(new Hours.new(hour.id, hour.timeFrom, hour.timeTo, hour.day, hour.room));

            pageData.set('loading', false);
        })
        .catch(() => {
            alert('Nie można pobrać ustawień!');
            page.frame.goBack();
        });

    
    
    pageData.set('hours', u.user.hours);

    // const listView = page.getViewById('main-list');
    // listView.refresh();

    page.bindingContext = pageData; 
}