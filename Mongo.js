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

      // получить из монги все сущесвующие id объектов по их id
      // filter: { id: { $in: objArr.map(o => o.id) } }
      // select:  { id: 1}

      // какие нужно создать
      // какие нужно проапдейтить

      const operations = objArr
      .map(
        (obj) => 
          {
            return {
        updateOne: {
          filter: { id: obj.id },
          update: { $set: obj },
          upsert: true
        }
            }
          }
      )

      const result = await collection.bulkWrite(operations)

      console.log(`В коллекцию ${collectionName} вставлено ${result.upsertedCount} новых объектов, ${result.modifiedCount} объектов было обновлено`)

    } catch (error) {

      console.error(`При добавлениении объекта в коллекцию ${collectionName} произошла ошибка: ${error}`)

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

module.exports = { Mongo }