const conn = require("config/database");



const getAllUsers = async () => {
    let [results, fields] = await conn.query('SELECT *FROM Users u ;');
    return results;
}

const undateUserById=async(userId,email,name,city)=>{
    const [results, fields] = await conn.query(`UPDATE Users Set email=?,name=? ,city=? WHERE id=?;`,
    [email, name, city, userId]);
    // return results;
}

const deleteUserById=async(userId)=>{
    const [results, fields] = await conn.query(`DELETE FROM Users  WHERE id=?;`,
    [userId]);
    // return results;
}

module.exports = {
    getAllUsers,
    undateUserById,
    deleteUserById
}