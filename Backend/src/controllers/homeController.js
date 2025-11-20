import bcrypt from "bcryptjs";


const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0/\/", salt);
//creat the connection to database


//

const handleHeloword = (req, res) => {
    return res.render("home.ejs",);
}



export default {
    handleHeloword
};

// module.exports = {
//     handleHeloword
// }