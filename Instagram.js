const { IgApiClient } = require("instagram-private-api")

class Instagram {
  constructor() {
    this.IG_USERNAME = null
      this.IG_PASSWORD = null
      this.ig = new IgApiClient()
    this.responseCount = 0
  }


  async initializeCredentials() {
    this.IG_USERNAME = process.env.IG_USERNAME
    this.IG_PASSWORD = process.env.IG_PASSWORD
  }


  //Авторизация в инстаграм
  async login() {
    try {

      await this.initializeCredentials()

      this.responseCount++
      this.ig.state.generateDevice(this.IG_USERNAME)

      await this.ig.account.login(this.IG_USERNAME, this.IG_PASSWORD)

    } catch (error) {

      throw new Error(`Ошибка при авторизации в инстаграм ${error}`)
      
    }
  }


  //Получение id пользователя
  async getIdUser(userName) {
    try {

      this.responseCount++
      return await this.ig.user.getIdByUsername(userName)

    } catch (error) {

      throw new Error (`Ошибка при получении ID пользователя ${error}`)

    }
  }


  //Получение полной информации о пользователе
  async getFullInfoUser(idUser) {
    try {

      this.responseCount++
      return await this.ig.user.info(idUser)

    } catch (error) {

      throw new Error (`Ошибка при получении информации о пользователе ${error}`)

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

      throw new Error (`Ошибка при получении подписок пользователе ${error}`)

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

      throw new Error (`Ошибка при получении подписчиков пользователе ${error}`)

    }
  }

}


module.exports = { Instagram }