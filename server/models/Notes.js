import mongoose from 'mongoose'

const notesSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true

    }
})

const notesModel=mongoose.model('notes',notesSchema);
export default notesModel;