exports.new = class H {
    constructor(id, from, to, day, room) {
        this.id = id;
        this.from = from.substr(0, 5);
        this.to = to.substr(0, 5);
        this.day = day;
        this.room = room;
        this.editing = false;
        this.timeStr = `${from} - ${to}`;
    }
};