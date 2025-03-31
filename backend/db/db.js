import mongoose from "mongoose";

function connect(){
    mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Connected to DataBase");
        })
        .catch(err =>{
            console.log(err);
        })
}

export default connect;