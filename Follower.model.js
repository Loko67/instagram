const mongoose = require("mongoose")
const Schema = mongoose.Schema


const FollowerSchema = new Schema(
  {
    id: String,

    _follow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },

    _follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },

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