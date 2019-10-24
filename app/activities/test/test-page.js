
let pageData = {
    text: ''
}

exports.pageLoaded = (args) => {
    const page = args.object;
    
    pageData.text = `UserID: ${page.navigationContext.user}`;
    
    page.bindingContext = pageData;
    
}