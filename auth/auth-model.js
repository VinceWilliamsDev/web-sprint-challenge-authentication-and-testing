const db = require('../database/dbConfig')

module.exports = {
    add,
    getById
}

function add(user) {
    try{
        return db('users')
            .insert(user)
            .returning('id')
            .then(ids => {
                return ids[0]
            })
    } catch (error) {
        throw error
    }
}

function getById(id) {
    return db("users")
    .where("id", id)
}