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
      type: Date
    },

    dtUpdatedAtUTC: {
      type: Date,
      default: undefined
    }

  },

  {
    versionKey: false,
    timestamps: {
      createdAt: "dtCreatedAtUTC",
      updatedAt: "dtUpdatedAtUTC"
    }
  }

)


const UserNameModel = mongoose.model("userName", UserNameSchema)

module.exports = { UserNameModel }