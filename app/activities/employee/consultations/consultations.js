const observableModule = require("tns-core-modules/data/observable");
const frameModule = require('tns-core-modules/ui/frame');
const listViewModule = require("tns-core-modules/ui/list-view");
const dialogsModule = require("tns-core-modules/ui/dialogs");

let pageData = new observableModule.fromObject({
    user: '',
    numberOfNotifications: 0,
    consultations: [
        {
            id: 1,
            student: 'Adrian Adriański',
            room: 243,
            date: new Date(2019, 10, 30, 10, 30, 0).getFullYear() + "-" + (new Date(2019, 10, 30, 10, 30, 0).getMonth() + 1) + "-" + new Date(2019, 10, 30, 10, 30, 0).getDate() + " " + new Date(2019, 10, 30, 10, 30, 0).getHours() + ":" + new Date(2019, 10, 30, 10, 30, 0).getMinutes(),
        
        },
        {
            id: 2,
            student: 'Damian Trisss',
            room: 211,
            date: new Date(2019, 11, 22, 8, 15, 0).getFullYear() + "-" + (new Date(2019, 11, 22, 8, 15, 0).getMonth() + 1) + "-" + new Date(2019, 11, 22, 8, 15, 0).getDate() + " " + new Date(2019, 11, 22, 8, 15, 0).getHours() + ":" + new Date(2019, 11, 22, 8, 15, 0).getMinutes() ,
        },
        {
            id: 66,
            student: 'Artur Yen',
            room: 453,
            date: new Date(2019, 11, 22, 8, 15, 0).getFullYear() + "-" + (new Date(2019, 11, 22, 8, 15, 0).getMonth() + 1) + "-" + new Date(2019, 11, 22, 8, 15, 0).getDate() + " " + new Date(2019, 11, 22, 8, 15, 0).getHours() + ":" + new Date(2019, 11, 22, 8, 15, 0).getMinutes() ,
        },
        {
            id: 4,
            student: 'Tomasz Chleb',
            room: 099,
            date: new Date(2019, 11, 22, 8, 15, 0).getFullYear() + "-" + (new Date(2019, 11, 22, 8, 15, 0).getMonth() + 1) + "-" + new Date(2019, 11, 22, 8, 15, 0).getDate() + " " + new Date(2019, 11, 22, 8, 15, 0).getHours() + ":" + new Date(2019, 11, 22, 8, 15, 0).getMinutes() ,
        },
        {
            id: 5,
            student: 'Karyna Karynowicz',
            room: 000,
            date: new Date(2019, 11, 22, 8, 15, 0).getFullYear() + "-" + (new Date(2019, 11, 22, 8, 15, 0).getMonth() + 1) + "-" + new Date(2019, 11, 22, 8, 15, 0).getDate() + " " + new Date(2019, 11, 22, 8, 15, 0).getHours() + ":" + new Date(2019, 11, 22, 8, 15, 0).getMinutes() ,
        },
        {
            id: 6,
            student: 'Agata Sukces',
            room: 777,
            date: new Date(2019, 11, 22, 8, 15, 0).getFullYear() + "-" + (new Date(2019, 11, 22, 8, 15, 0).getMonth() + 1) + "-" + new Date(2019, 11, 22, 8, 15, 0).getDate() + " " + new Date(2019, 11, 22, 8, 15, 0).getHours() + ":" + new Date(2019, 11, 22, 8, 15, 0).getMinutes() ,
        },
        {
            id: 7,
            student: 'Brajan Dżons',
            room: 343,
            date: new Date(2019, 11, 22, 8, 15, 0).getFullYear() + "-" + (new Date(2019, 11, 22, 8, 15, 0).getMonth() + 1) + "-" + new Date(2019, 11, 22, 8, 15, 0).getDate() + " " + new Date(2019, 11, 22, 8, 15, 0).getHours() + ":" + new Date(2019, 11, 22, 8, 15, 0).getMinutes() ,
        }
    ],
    reasons: [
        "Dzisiaj mnie brzuch boli",
        "Mam ważniejsze rzeczy",
        "+ Dodaj własny powód"
    ],
    index: false
});

exports.exit = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.pageLoaded = (args) => {
    let page = args.object;
    const context = page.navigationContext;
    pageData.set('user', `${context.user}`);
    pageData.set('numberOfNotifications', `${context.numberOfNotifications}`);
    page.bindingContext = pageData; 
    listView = page.getViewById("listView");
   // var buttonWrapper = page.getViewById("buttonWrapper");
    //test = page.getViewById("btn_1");
    // const Button = require("tns-core-modules/ui/button").Button;
    // var button = new Button();
    // button.style = "background: red; width: 200px; height: 100px;" 
    // button.text = "Something";
    // buttonWrapper.addChild(button);
}

exports.accept = (args) => {
    //to do
}
function isEqual(element, number){
    return element = 66;
}
exports.decline = (args) => {
    
    pageData.index = pageData.consultations.findIndex(isEqual);
    console.log(pageData.index);


    dialogsModule.confirm({
    title: "Odrzuć",
    message: "Czy na pewno chcesz odrzucić?",
    okButtonText: "Potwierdź",
    cancelButtonText: "Anuluj",
}).then(function (result) {
    if (result){
        chooseReason();
    }
});
}
function chooseReason(){
    dialogsModule.action({
    message: "Wybierz powód",
    cancelButtonText: "Anuluj",
    actions: pageData.reasons
}).then(function (result) {
    if (result == "+ Dodaj własny powód"){
        addReason();
    }else if (result != "Anuluj"){
        console.log(result);
        deleteConsultation();
    }else{
        console.log(result);
    }
});
}
function addReason(){
    dialogsModule.prompt("Dodaj powód", "tutaj wpisz własny").then(function (r) {
        console.log("Dialog result: " + r.result + ", text: " + r.text);
        if (r.result == true)
            deleteConsultation();
    }); 
}
function onItemTap(args) {
    pageData.index = args.index;
    

}
exports.onItemTap = onItemTap;

function deleteConsultation(){
    pageData.consultations.splice(pageData.index , 1);
    listView.refresh();
}