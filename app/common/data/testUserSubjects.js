const u = require('./user');
exports.testUserSubjects = [    
    {
        id: 11,
        title: 'Programowanie obiektowe',
        semester: 1,
        employees: [{
            id: 4,
            name: 'Jan',
            surname: 'Kowalski'
        },
        {
            id: u.user.id,
            name: u.user.name,
            surname: u.user.surname
        },
        {
            id: 3,
            name: 'Tomasz',
            surname: 'Grela'
        }
    ],
    },
    {
        id: 12,
        title: 'Chmury',
        semester: 3,
        employees: [
        {
            id: 3,
            name: 'Andrzej',
            surname: 'Andrzejewski'
        },
        {
            id: u.user.id,
            name: u.user.name,
            surname: u.user.surname
        },
    ]
    },
    {
        id: 13,
        title: 'Systemy wbudowane',
        semester: 2,
        employees: [
        {
            id: u.user.id,
            name: u.user.name,
            surname: u.user.surname
        },    
        {
            id: 4,
            name: 'Jan',
            surname: 'Kowalski'
        },
        {
            id: 3,
            name: 'Tomasz',
            surname: 'Grela'
        },
        {
            id: 5,
            name: 'Ewa',
            surname: 'Jabłoń'
        }]
    }]