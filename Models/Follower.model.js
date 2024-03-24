const mongoose = require("mongoose")
const Schema = mongoose.Schema


const FollowerSchema = new Schema(
  {
    id: String,

    _follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },

    _following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },

    dtCreatedAtUTC: {
      type: Date
    },

    dtUpdatedAtUTC: {
      type: Date
    },
  },

  {
    versionKey: false,
    timestamps: {
      createdAt: "dtCreatedAtUTC",
      updatedAt: "dtUpdatedAtUTC"
    }
  }

)


const FollowerModel = mongoose.model("followers", FollowerSchema)

module.exports = { FollowerModel }