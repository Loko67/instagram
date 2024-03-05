const { UserModel } = require("./User.model")
const { FollowerModel } = require("./Follower.model")

function prepareNewUser(rawUser) {

  return new UserModel(
    {
      id: rawUser.pk,
      fullName: rawUser.full_name || '',
      userName: rawUser.username,
      is_private: rawUser.is_private,
    }
  )
}


function prepareUpdateUser(rawUser) {

  return {
    id: rawUser.pk,
    fullName: rawUser.full_name || '',
    userName: rawUser.username,
    is_private: rawUser.is_private,
    dtUpdatedAtUTC: new Date()
  }

}


function prepareUpdateFollower(idFollower, idFollowing) {

  return {
    id: `_${idFollowing}__${idFollower}`,
    follower: `_${idFollower}`,
    following: `_${idFollowing}`,
    dtUpdatedAtUTC: new Date()
  }

}


function prepareNewFollower(idFollower, idFollowing) {

  return new FollowerModel(
    {
      id: `_${idFollowing}__${idFollower}`,
      follower: `_${idFollower}`,
      following: `_${idFollowing}`,
    }
  )

}


async function updateToDb(obj, Model) {

  await Model.updateOne(
    { id: obj.id },
    { $set: obj },
    { upsert: false }
  )

}


async function getAllObjFromBd(Model) {

  return (await Model.find({}).select("id"))
    .map(obj => obj.id)

}


module.exports = {
  updateToDb,
  getAllObjFromBd,
  prepareUpdateUser,
  prepareNewUser,
  prepareNewFollower,
  prepareUpdateFollower
}