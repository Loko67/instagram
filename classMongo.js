const { MongoClient } = require('mongodb')

class Mongo {

  constructor(dataBase) {

    this.dataBase = dataBase,
      this.MongoDBclient = new MongoClient(process.env.MONGO_HOST)

  }

  //Открытие соединения
  async connect() {
    try {

      await this.MongoDBclient.connect()
      this.db = this.MongoDBclient.db(this.dataBase)

    } catch (error) {

      console.error(`При подключении к БД произошла ошибка: ${error}`)

    }
  }

  //Добавление массива объетов в коллекцию
  async insertObj(collectionName, objArr) {
    try {

      const collection = this.db.collection(collectionName)

      const operations = objArr.map(obj => ({
        updateOne: {
          filter: { id: obj.id },
          update: { $set: obj },
          upsert: true
        }
      }))

      const result = await collection.bulkWrite(operations)

      console.log(`Добавлено ${result.modifiedCount} объектов, вставлено ${result.upsertedCount} новых объектов.`)

    } catch (error) {

      console.error(`При добавлениении объека в коллекцию ${collectionName} произошла ошибка: ${error}`)

    }
  }

  //Закрытие соединения
  async close() {
    try {

      await this.MongoDBclient.close()

    } catch (error) {

      console.error(`При закрытии подключения к БД произошла ошибка: ${error}`)

    }
  }
}

module.exports = Mongo