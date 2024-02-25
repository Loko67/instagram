function prepareUser(rawUser) {

  return {
    id: rawUser.pk,
    fullName: rawUser.full_name || null,
    userName: rawUser.username,
    is_private: rawUser.is_private
  }

}

//Связь пользователь + подписчики
function prepareAddictionFollower(idUser, follower) {
  try {

    return {
      //кто подписан + на кого подписан
      id: `_${follower.pk}__${idUser}`,
      follower: `_${follower.pk}`,
      following: `_${idUser}`
    }

  } catch (error) {

    console.error(`Ошибка при создании связи ${follower.pk} + ${idUser}`)

  }
}

//Связь пользователь + подписки
function prepareAddictionFollowing(idUser, following) {
  try {

    return {
      //кто подписан + на кого подписан
      id: `_${idUser}__${following.pk}`,
      follower: `_${idUser}`,
      following: `_${following.pk}`
    }

  } catch (error) {

    console.error(`Ошибка при создании связи ${idUser} + ${follower.pk}`)

  }
}

module.exports = {
  prepareUser,
  prepareAddictionFollower,
  prepareAddictionFollowing
}