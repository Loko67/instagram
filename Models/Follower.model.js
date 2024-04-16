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
      type: Date,
      default: new Date(),
    },

    dtUpdatedAtUTC: Date

  },

  {
    versionKey: false,
  }

)


FollowerSchema.pre(
  "updateOne",
  function (next) {
    this.getUpdate().dtUpdatedAtUTC = new Date()

    next()
  })


const FollowerModel = mongoose.model("followers", FollowerSchema)

module.exports = { FollowerModel }