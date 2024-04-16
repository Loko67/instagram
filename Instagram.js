const { IgApiClient } = require("instagram-private-api")

const utils = require("./utils")

class Instagram {
  constructor() {
    this.IG_USERNAME = null
    this.IG_PASSWORD = null
    this.ig = new IgApiClient()
    this.requestCount = 0
  }


  async initializeCredentials() {
    this.IG_USERNAME = process.env.IG_USERNAME
    this.IG_PASSWORD = process.env.IG_PASSWORD
  }


  //Авторизация в инстаграм
  async login() {
    try {

      await this.initializeCredentials()

      this.ig.state.generateDevice(this.IG_USERNAME)

      await this.ig.account.login(this.IG_USERNAME, this.IG_PASSWORD)

    } catch (error) {

      throw new Error(`Ошибка при авторизации в инстаграм ${error}`)

    }
  }


  //Получение id пользователя
  async getIdUser(userName) {
    try {

      return await this.ig.user.getIdByUsername(userName)

    } catch (error) {

      throw new Error(`Ошибка при получении ID пользователя ${error}`)

    }
  }


  //Получение полной информации о пользователе
  async getFullInfoUser(idUser) {
    try {

      return await this.ig.user.info(idUser)

    } catch (error) {

      throw new Error(`Ошибка при получении информации о пользователе ${error}`)

    }
  }


  //Получение подписок пользователя
  async* getFollowing(idUser) {
    try {

      let isMoreAvailable = true

      const followingFeed = this.ig.feed.accountFollowing(idUser)

      while (isMoreAvailable) {

        this.requestCount++

        const followingArr = (await followingFeed.request()).users

        for (let following of followingArr) {
          yield following
        }

        isMoreAvailable = followingFeed.isMoreAvailable()

        if (this.requestCount % 10 == 0) {

          await utils.delay(utils.getRandomNumber(5000, 15000))
          await this.login()

        } else {

          await utils.delay(utils.getRandomNumber(1000, 5000))

        }

      }


    } catch (error) {

      throw new Error(`Ошибка при получении подписок пользователе ${error}`)

    }
  }


  //Получение подписчиков пользователя
  async* getFollower(idUser) {
    try {

      let isMoreAvailable = true

      const followerFeed = this.ig.feed.accountFollowers(idUser)

      while (isMoreAvailable) {

        this.requestCount++

        const followerArr = (await followerFeed.request()).users

        for (let follower of followerArr) {
          yield follower
        }

        isMoreAvailable = followerFeed.isMoreAvailable()

        if (this.requestCount % 10 == 0) {

          await utils.delay(utils.getRandomNumber(5000, 15000))
          await this.login()

        } else {

          await utils.delay(utils.getRandomNumber(1000, 5000))

        }

      }

    } catch (error) {

      throw new Error(`Ошибка при получении подписчиков пользователе ${error}`)

    }
  }

}


module.exports = { Instagram }