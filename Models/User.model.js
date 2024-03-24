const mongoose = require("mongoose")
const Schema = mongoose.Schema


const UserSchema = new Schema(
  {
    id: String,
    fullName: String,
    userName: String,

    dtCreatedAtUTC: {
      type: Date
    },

    dtUpdatedAtUTC: {
      type: Date,
      default: undefined
    },

    is_private: Boolean

  },

  {
    versionKey: false,
    timestamps: {
      createdAt: "dtCreatedAtUTC",
      updatedAt: "dtUpdatedAtUTC"
    }
  }

)


const UserModel = mongoose.model("users", UserSchema)

module.exports = { UserModel }