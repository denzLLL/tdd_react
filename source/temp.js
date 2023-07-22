
const users =  [
    {"id": 1, "username": "user1", "email": "user1@mail.com", "image": null},
    {"id": 2, "username": "user2", "email": "user2@mail.com", "image": null},
    {"id": 3, "username": "user3", "email": "user3@mail.com", "image": null},
    {"id": 4, "username": "user4", "email": "user4@mail.com", "image": null},
    {"id": 5, "username": "user5", "email": "user5@mail.com", "image": null},
    {"id": 6, "username": "user6", "email": "user6@mail.com", "image": null},
    {"id": 7, "username": "user7", "email": "user7@mail.com", "image": null},
    {"id": 8, "username": "user8", "email": "user8@mail.com", "image": null},
    {"id": 9, "username": "user9", "email": "user9@mail.com", "image": null}
]

const getPage = (page, size) => {
    let start = page * size;
    let end = start + size;
    return {
        content: users.slice(start, end),
        page,
        size,
        totalPages: Math.ceil(users.length / size)
    }
}

const page1 = {
    "content": users,
    "page": 0,
    "size": 3,
    "totalPages": 9
}
