const { UserModel } = require("./Models/User.model")
const { FollowerModel } = require("./Models/Follower.model")
const { UserNameModel } = require("./Models/UserName.model")

/**
 * Создание нового или обновление существующего объекта user
 * на основе объекта из Instagram
 * 
 * @param {Object} rawUser объект пользователя из Instagram
 * 
 */
async function upsertUser(rawUser) {

  try {

    const newUser = {
      id: rawUser.pk,
      fullName: rawUser.full_name || '',
      userName: rawUser.username,
      is_private: rawUser.is_private,
    }

    await UserModel.updateOne(

      { id: rawUser.pk },
      { $set: newUser },
      { upsert: true }

    )

  } catch (error) {

    throw new Error(`Ошибка при создании юзера: ${error}`)

  }

}


/**
 * Создание нового или обновление существующего объекта follower
 * с зависимостью между пользователями
 * 
 * @param {String} idFollower id пользователя-подписчика
 * @param {String} idFollowing id пользователя, на которого подписан
 * 
 */
async function upsertFollower(idFollower, idFollowing) {

  try {

    const follower = await UserModel.findOne({ id: idFollower })
    const following = await UserModel.findOne({ id: idFollowing })

    const newFollower = {
      id: `_${idFollowing}__${idFollower}`,
      _follower: follower._id,
      _following: following._id
    }

    await FollowerModel.updateOne(

      { id: `_${idFollowing}__${idFollower}` },
      { $set: newFollower },
      { upsert: true }

    )

  } catch (error) {

    throw new Error(`Ошибка при создании подписчика ${error}`)

  }

}

/**
 * Создание нового или обновление существующего объекта userName
 * с указанием предыдущего имени пользователя
 * 
 * @param {Object} rawUser объект пользователя из Instagram
 * 
 */
async function upsertUserName(rawUser) {

  const user = await UserModel.findOne({ id: rawUser.pk })

  if (user && rawUser.username != user.userName) {

    try {

      const newUserName = {
        id: `_${user.id}__${user.userName}_${new Date().getTime()}`,
        _userId: user._id,
        userName: user.userName
      }

      await UserNameModel.updateOne(

        { userName: user.userName, _userId: user._id },
        { $set: newUserName },
        { upsert: true }

      )

    } catch (error) {

      throw new Error(`Ошибка при создании UserName ${error}`)

    }
  }

}

/**
 * Delay
 * @param {number} duration ms
 * @return {*}
 */
function delay(duration) {
  return new Promise(
    function (resolve, reject) {
      setTimeout(
        function () {
          resolve()
        },
        duration
      )
    }
  )
}

/**
 * Генерация случайного числа в заданном диапазоне.
 * @param {number} min - Нижняя граница диапазона (включительно).
 * @param {number} max - Верхняя граница диапазона (включительно).
 * @return {number} Случайное целое число в заданном диапазоне.
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {
  upsertUser,
  upsertFollower,
  upsertUserName,
  delay,
  getRandomNumber
}