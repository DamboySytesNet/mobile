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
        var start = new Date(new Date().getFullYear(), 0, 0);
        var diff = this.date - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var dayOfTheYear = Math.floor(diff / oneDay);

        return dayOfTheYear;
    }
};