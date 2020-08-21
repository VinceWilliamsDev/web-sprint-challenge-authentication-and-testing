const db = require('../database/dbConfig')

module.exports = {
    add,
    getBy
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

function getBy(filter) {
    return db("users")
    .where(filter)
}