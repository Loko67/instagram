const { UserModel } = require("./User.model")
const { FollowerModel } = require("./Follower.model")
const { UserNameModel } = require("./UserName.model")

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


async function updateUserName(obj) {

  const user = await UserModel.findOne({ id: obj.pk })

  const userName = await UserNameModel.findOne({ userName: obj.username });

  userName ?
    await updateToDb(
      {
        id: userName.id,
        _userId: user._id,
        userName: obj.username
      },
      UserNameModel) :

    await new UserNameModel(

      {
        id: `_${obj.pk}__${obj.username}_${new Date().getTime()}`,
        _userId: user._id,
        userName: obj.username,
        dtCreatedAtUTC: new Date()
      }
    ).save()

}


async function prepareUpdateUser(rawUser) {

  const user = await UserModel.findOne({ id: rawUser.pk })

  const updateUser = {
    id: rawUser.pk,
    fullName: rawUser.full_name || '',
    is_private: rawUser.is_private
  }


  if (rawUser.username == user.userName) {

    return updateUser

  } else {

    await updateUserName(rawUser)
    return updateUser

  }
}


function prepareUpdateFollower(idFollower, idFollowing) {

  return {
    id: `_${idFollowing}__${idFollower}`,
    follower: `_${idFollower}`,
    following: `_${idFollowing}`
  }

}


async function prepareNewFollower(idFollower, idFollowing) {

  const follower = await UserModel.findOne({ id: idFollower })
  const following = await UserModel.findOne({ id: idFollowing })

  return new FollowerModel(
    {
      id: `_${idFollowing}__${idFollower}`,
      _follower: follower._id,
      _following: following._id
    }
  )

}


async function updateToDb(obj, Model) {

  obj.dtUpdatedAtUTC = new Date()

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