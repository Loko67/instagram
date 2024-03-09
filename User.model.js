const mongoose = require("mongoose")
const Schema = mongoose.Schema


const UserSchema = new Schema(
  {
    fullName: String,
    userName: String,
    dtCreatedAtUTC: {
      type: Date,
      default: Date.now()
    },
    dtUpdatedAtUTC: {
      type: Date,
      default: undefined
    },
    is_private: Boolean
  },
  { versionKey: false }
)


UserSchema.pre(
  'save',
  function (next) {
    let nowDate = new Date()

    if (!this.isNew) {
      this.dtUpdatedAt = nowDate
    }

    next()
  }
)


UserSchema.pre(
  'updateOne',
  function (next) {
    this.dtUpdatedAt = new Date()

    next()
  }
)


const UserModel = mongoose.model("users", UserSchema)

module.exports = { UserModel }