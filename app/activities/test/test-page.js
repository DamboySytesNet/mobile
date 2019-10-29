
let pageData = {
    text: ''
}

exports.pageLoaded = (args) => {
    const page = args.object;
    
    pageData.text = `UserID: ${page.navigationContext.id}`;
    
    page.bindingContext = pageData;
    
}