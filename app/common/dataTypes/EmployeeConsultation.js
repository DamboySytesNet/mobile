const Consultation = require("~/common/dataTypes/Consultation");

exports.new = class eC extends Consultation.Cons {
    constructor(id, subject, teacher, student, room, date, state, excuse) {
        super(id, subject, teacher, room, date, state, excuse)
        
        this.student = student;
    }
}



