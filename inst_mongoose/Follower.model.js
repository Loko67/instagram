const mongoose = require("mongoose")
const Schema = mongoose.Schema


const FollowerSchema = new Schema(
  {
    id: String,
    _follow: String,
    _follower: String,

    dtCreatedAtUTC: {
      type: Date,
      default: Date.now()
    },

    dtUpdatedAtUTC: {
      type: Date,
      default: undefined
    },
  },

  {
    versionKey: false,
  }

)


const FollowerModel = mongoose.model("followers", FollowerSchema)

module.exports = { FollowerModel }