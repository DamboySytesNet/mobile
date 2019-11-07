exports.Cons = class Consultation {
    constructor(id, subject, teacher, room, date, state, excuse) {
        this.id = id;
        this.subject = subject;
        this.teacher = teacher;
        this.room = room;
        // this.date = date;
        this.date = new Date(date);
        this.state = state;
        this.excuse = excuse;

        this.timeStr = `${this.date.getHours()}:${this.date.getMinutes()}`;
        this.dayOfTheYear = this.getDayOfTheYear();
        
    }

    getDayOfTheYear() {
        let now = new Date();
        let start;
        if (now.getMonth() >= 9) {
            start = new Date(now.getFullYear(), 9, 1);
        } 
        else {
            start = new Date(now.getFullYear() - 1, 9, 1);
        }
        var diff = this.date - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var dayOfTheYear = Math.floor(diff / oneDay);

        return dayOfTheYear;
    }
};