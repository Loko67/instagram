const mongoose = require("mongoose")
const Schema = mongoose.Schema


const UserNameSchema = new Schema(
  {
    id: String,

    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },

    userName: String,

    dtCreatedAtUTC: {
      type: Date,
      default: Date.now()
    },

    dtUpdatedAtUTC: {
      type: Date,
      default: undefined
    }
    
  },

  { versionKey: false }

)


const UserNameModel = mongoose.model("userName", UserNameSchema)

module.exports = { UserNameModel }