const observableModule = require("tns-core-modules/data/observable");

let pageData = observableModule.fromObject({
    data: {}
});

let page = null;

exports.onPageLoaded = (args) => {
    page = args.object;
    const consultationInfo = page.navigationContext.data;
    pageData.set("data", consultationInfo);

    page.bindingContext = pageData;
}

exports.exit = (args) => {
    page.frame.goBack();
}