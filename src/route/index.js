// Підключаємо технологію express для back-end сервера
const e = require('express')
const express = require('express')
const { info } = require('sass')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

class Product {
  static #list = []

  constructor(name, price, description) {
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 90000) + 10000
  }

  verifyInfo = (description) =>
    this.description === description

  static add = (product) => {
    this.#list.push(product)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)

      return true
    } else {
      return false
    }
  }

  static update = (product, { price }) => {
    if (price) {
      product.price = price
    }
  }
}

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Emaйл пошта оновлена'
      : 'Emaйл пошта не оновлена',
  })
})

router.get('/product-create', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))

  res.render('product-info', {
    style: 'product-info',
    info: 'Користувач видалений',
  })
})

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  if (!name) {
    res.render('product-info', {
      style: 'product-info',
      info: 'Помилка, ви не вказали назву товару',
    })
    return false
  }

  if (price.length < 5) {
    res.render('product-info', {
      style: 'product-info',
      info: 'Помилка, ціна мусить містити мінімум 5 цифр',
    })
    return false
  }

  let result = false

  const product1 = new Product(name, price, description)

  Product.add(product1)

  const productId = product1.id

  const product = Product.getById(Number(productId))

  if (product1.verifyInfo(description)) {
    Product.update(product, { price })
    console.log(Product.getList())
    result = true
  }

  res.render('product-info', {
    style: 'product-info',
    info: result
      ? 'Успішне виконання дії'
      : 'Помилка,товар не вдалось придбати',
  })
})

router.get('/product-list', function (req, res) {
  const productList = Product.getList()
  res.render('product-list', {
    style: 'product-list',
    product: productList,
  })
})

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const productId = Product.getById(Number(id))

  if (!productId) {
    res.render('product-edit', {
      style: 'product-edit',
      info: 'Такого ID не знайдено',
    })
    return false
  }

  res.render('product-edit', {
    style: 'product-edit',
    product: productId,
  })
})

router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  let result = false

  if (!name || !price || id.length < 10) {
    res.render('product-infoList', {
      style: 'product-infoList',
      info: 'Помилка, ви не вказали нічого для змінни товару',
    })
    return console.info(
      'Можливо ви не вказли ціну, назву або ж ваш айді є не праильним ,або занаддто коротким',
    )
  }

  const product1 = new Product(name, price, description)

  Product.add(product1)

  const productId = product1.id

  const product = Product.getById(Number(productId))

  if (product1.verifyInfo(description)) {
    Product.update(product, { price })
    console.log(Product.getList())
    result = true
  }

  res.render('product-infoList', {
    style: 'product-infoList',
    info: result
      ? 'Успішне виконання дії'
      : 'Помилка,товар не вдалось редагувати',
  })
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))

  res.render('product-delete', {
    style: 'product-delete',
    info: 'Товар видалений',
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
