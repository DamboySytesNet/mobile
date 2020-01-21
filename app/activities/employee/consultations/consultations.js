const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");
const EmployeeConsultation = require("~/common/dataTypes/EmployeeConsultation");
const u = require("~/common/data/user");
const ConsultationsEmployeeHttpRequest = require("~/modules/request/consultationsEmployeeHttpRequest");
const Excuse = require("~/common/dataTypes/Excuse");

let page;

let pageData = new observableModule.fromObject({
    consultations: [],
    reasons: []
});

exports.back = args => {
    const button = args.object;
    page = button.page;

    page.frame.goBack();
};

exports.pageLoaded = args => {
    page = args.object;
    pageData.reasons.splice(0, pageData.reasons.length);
    ConsultationsEmployeeHttpRequest.getExcuses(u.user.id, u.user.token)
        .then(res => {
            for (const it of res) {
                pageData.reasons.push(new Excuse.new(it.id, it.text));
            }
        })
        .catch(() => {
            alert("Nie udało sie pobrać powodów!");
            page.frame.goBack();
        });

    ConsultationsEmployeeHttpRequest.get(u.user.id, u.user.token)
        .then(res => {
            u.user.consultations.data = loadEmployeeConsultations(res);
            pageData.set(
                "consultations",
                groupByDayOfTheYear(u.user.consultations.data)
            );
            page.bindingContext = pageData;
            list = page.getViewById("list");
            listView = page.getViewById("listView");
        })
        .catch(() => {
            alert("Nie udało sie pobrać konsultacji!");
            page.frame.goBack();
        });
};

exports.accept = args => {
    let id = parseInt(args.object.index, 10);
    let student_id = u.user.consultations.data.find(el => {
        return el.id === id;
    }).studentId;

    ConsultationsEmployeeHttpRequest.setState(
            u.user.id,
            student_id,
            id,
            2,
            null,
            u.user.token
        )
        .then(res => {
            for (let i of pageData.get("consultations")) {
                let tmp = i.cons.find(el => el.id === id);
                if (tmp) {
                    tmp.state = "Zatwierdzona";
                    tmp.excuse = null;
                    listView.refresh();
                    break;
                }
            }
        })
        .catch(() => {
            alert("Nie udało sie zmienić stanu konsultacji!");
        });
};

exports.decline = args => {
    dialogsModule
        .confirm({
            title: "Odrzuć",
            message: "Czy na pewno chcesz odrzucić?",
            okButtonText: "Potwierdź",
            cancelButtonText: "Anuluj"
        })
        .then(function (result) {
            if (result) {
                chooseReason(args);
            }
        });
};

function chooseReason(args) {
    let tmp = [];
    let addExcuseText = "+ Dodaj własny powód";
    pageData.reasons.forEach(element => {
        tmp.push(element.text);
    });
    tmp.push(addExcuseText);
    dialogsModule
        .action({
            message: "Wybierz powód",
            cancelButtonText: "Anuluj",
            actions: tmp
        })
        .then(function (result) {
            if (result === addExcuseText) {
                addReason(args);
            } else if (result === "Anuluj") {
                return;
            } else deleteConsultation(args, result);
        });
}

function addReason(args) {
    dialogsModule.prompt("Dodaj powód", "").then(function (r) {
        if (r.result) {
            ConsultationsEmployeeHttpRequest.addExcuse(
                    u.user.id,
                    r.text,
                    u.user.token
                )
                .then(res => {
                    pageData.reasons.push(new Excuse.new(res, r.text));
                    deleteConsultation(args, r.text);
                })
                .catch(() => {
                    alert("Nie udało sie dodać nowego powodu!");
                });
        }
    });
}

function deleteConsultation(args, excuseText) {
    let id = parseInt(args.object.index, 10);
    let excuseId = pageData.reasons.find(el => {
        return el.text === excuseText;
    }).id;
    let student_id = u.user.consultations.data.find(el => {
        return el.id === id;
    }).studentId;
    ConsultationsEmployeeHttpRequest.setState(
            u.user.id,
            student_id,
            id,
            3,
            excuseId,
            u.user.token
        )
        .then(res => {
            for (let i of pageData.get("consultations")) {
                let tmp = i.cons.find(el => el.id === id);
                if (tmp) {
                    tmp.state = "Odrzucona";
                    tmp.excuse = excuseText;
                    listView.refresh();
                    break;
                }
            }
        })
        .catch(() => {
            alert("Nie udało sie zmienić stanu konsultacji!");
        });
}

function loadEmployeeConsultations(cons) {
    const c = [];
    for (let con of cons) {
        c.push(
            new EmployeeConsultation.new(
                con.id,
                null,
                null,
                con.studentId,
                con.student,
                con.room,
                `${con.date} ${con.timeFrom}`,
                con.state,
                con.excuse
            )
        );
    }
    return c;
}

function groupByDayOfTheYear(arr) {
    let uniqueDays = new Set();

    for (let a of arr) {
        uniqueDays.add(a.dayOfTheYear);
    }

    let grouped = [];

    for (let day of uniqueDays) {
        grouped.push({
            cons: arr.filter(c => {
                return c.dayOfTheYear == day;
            }),
            day: day,
            height: 190 //height of 1 consulatation
        });
    }

    let today = new Date();
    for (let gr of grouped) {
        let conDay = gr.cons[0].date;
        let prefix = "";
        if (
            today.getYear() === conDay.getYear() &&
            today.getMonth() === conDay.getMonth()
        ) {
            if (today.getDate() === conDay.getDate()) {
                prefix = "Dziś ";
            } else if (today.getDate() + 1 === conDay.getDate())
                prefix = "Jutro ";
        }
        gr["date"] = `${prefix} ${conDay.getDate()}.${conDay.getMonth() +
            1}.${conDay.getYear() + 1900}`;
        gr.cons.sort((a, b) => (a.date > b.date ? 1 : -1));
    }
    grouped.sort((a, b) => (a.day > b.day ? 1 : -1));
    for (let i of grouped) {
        i.height *= i.cons.length;
    }
    return grouped;
}
