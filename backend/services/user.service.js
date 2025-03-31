import userModle from '../models/user.model.js';


export const createUser = async ({email,password})=>{
    if(!email || !password){
        throw new Error('Email and Password are required');
    }

    const hashedPassword = await userModle.hashPassword(password);

    const user = await userModle.create({
        email,
        password: hashedPassword
    });

    return user;
}


export const getAllUsers = async ({ userId }) => {
    const users = await userModle.find({
        _id: { $ne: userId }
    });
    return users;
}
