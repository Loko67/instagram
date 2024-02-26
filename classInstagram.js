const { IgApiClient } = require("instagram-private-api")

class Instagram {
  constructor() {
    this.IG_USERNAME = process.env.IG_USERNAME,
      this.IG_PASSWORD = process.env.IG_PASSWORD,
      this.ig = new IgApiClient()
    this.responseCount = 0
  }

  //Авторизация в инстаграм
  async login() {
    try {

      this.responseCount++
      this.ig.state.generateDevice(this.IG_USERNAME)
      await this.ig.account.login(this.IG_USERNAME, this.IG_PASSWORD)

    } catch (error) {

      console.error(`Ошибка при авторизации в инстаграм ${error}`)

    }
  }

  //Получение id пользователя
  async getIdUser(userName) {
    try {

      this.responseCount++
      return await this.ig.user.getIdByUsername(userName)

    } catch (error) {

      console.error(`Ошибка при получении ID пользователя ${error}`)

      return null

    }
  }

  //Получение полной информации о пользователе
  async getFullInfoUser(idUser) {
    try {

      this.responseCount++
      return await this.ig.user.info(idUser)

    } catch (error) {

      console.error(`Ошибка при получении информации о пользователе ${error}`)

      return null

    }
  }

  //Получение подписок пользователя
  async getFollowing(idUser) {
    try {

      const following = []

      let isMoreAvailable = true

      const followingFeed = this.ig.feed.accountFollowing(idUser)

      do {
        this.responseCount++
        const followingArr = (await followingFeed.request()).users
        following.push(...followingArr)
        isMoreAvailable = followingFeed.isMoreAvailable()
      }
      while (isMoreAvailable)

      return following

    } catch (error) {

      console.error(`Ошибка при получении подписок пользователе ${error}`)

      return []

    }
  }

  //Получение подписчиков пользователя
  async getFollower(idUser) {
    try {

      const follower = []

      let isMoreAvailable = true

      const followerFeed = this.ig.feed.accountFollowers(idUser)

      do {
        this.responseCount++
        const followerArr = (await followerFeed.request()).users
        follower.push(...followerArr)
        isMoreAvailable = followerFeed.isMoreAvailable()
      }
      while (isMoreAvailable)

      return follower

    } catch (error) {

      console.error(`Ошибка при получении подписчиков пользователе ${error}`)

      return []

    }
  }
}

module.exports = Instagram