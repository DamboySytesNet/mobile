const observableModule = require("tns-core-modules/data/observable");

let pageData = new observableModule.fromObject({
    user: '',
    consultations: []
})

exports.backToCockpit = (args) => {
    const button = args.object;
    const page = button.page;
    
    page.frame.goBack();
}

exports.onPageLoaded = (args) => {
    let page = args.object;
    const context = page.navigationContext;

    // pageData.set('user', `${context.user}`);
    pageData.set('consultations', context.consultations);

    alert(consToStr(pageData.consultations));
}

function consToStr(cons) {
    let s = '';

    for(let i = 0; i< cons.length; i++) {
        // alert(cons[i].id);
        // alert(cons[i].subject);
        s += cons[i].id + " " + cons[i].subject + " " + cons[i].teacher + " " + cons[i].room + "\n"; 
    }
    return s;
}
