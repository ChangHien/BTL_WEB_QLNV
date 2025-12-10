import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import jwtConfig from '../config/jwtConfig.js';

const TaiKhoan = db.TaiKhoan

export const generateToken = (payload) =>{
    return jwt.sign(
        payload,
        jwtConfig.SECRET,
        {
            expiresIn: jwtConfig.EXPIRATION
        }
    )
}

export const verifyUser = async (username, password) => {
    const user = await TaiKhoan.findOne ({where: {username}})
    if (!user) {
        return {success: false, message: " ten dang nhap khong ton tai."}
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) {
        return {
            success: false,
            message: "Mat khau khong dung."
        }
    }return {
        success: true,
        user:{
            ma_nhan_vien: user.ma_nhan_vien,
            role: user.role,
            username: user.username
        }
    }
}
export const registerUser = async (username, password, ma_nhan_vien, role) => {
    const hashedPassword = bcrypt.hashSync (password, 10);
    const newAccount = await TaiKhoan.create ({
        username, 
        password: hashedPassword,
        ma_nhan_vien,
        role
    })
    return newAccount
}
