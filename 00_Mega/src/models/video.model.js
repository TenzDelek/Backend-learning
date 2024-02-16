import mongoose,{Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const videoSchema=new Schema(
    {
        videoFile:{
            type:String,//cloudnary file
            required:true
        },
        thumbnail:{
            type:String,//cloudnary file
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number,//from cloudinary
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    })

videoSchema.plugin(mongooseAggregatePaginate)
//aggregation helps to perform multiple task at the same time
export const Video=mongoose.model("Video",videoSchema)