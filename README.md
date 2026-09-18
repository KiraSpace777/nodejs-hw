## ===== NPM INSTALL ====

### // npm init -y

Ініціалізуйте npm: З’явиться файл package.json із базовою інформацією про проєкт.

### // npm install -D nodemon

пакет nodemon автоматично перезапускає застосунок після змін у файлах.

### // npm init @eslint/config@latest

Лінтинг коду, дозволяє задати єдиний стиль написання коду

### // npm install express

мінімалістичний веб-фреймворк для Node.js

### // npm install cors

Cross-Origin Resource Sharing — механізм безпеки, який дозволяє браузеру робити запити з одного домену до іншого

### // npm install pino-http pino-pretty

Логування запитів (логер pino-http), вхідні/вихідні запити, час обробки

### // npm install dotenv

зчитування змінних оточення

### // npm install mongoose

Щоб працювати з базою даних, нам потрібно підключитися до неї зі свого бекенду. Робити це "вручну" через драйвер MongoDB незручно, тому ми використаємо бібліотеку Mongoose.

### // npm install http-errors "Використання http-errors

Щоб замінити стандартну відповідь про помилку - 500 Internal Server Error на динамічну, наприклад, повернути 404 Not Found. Пакет http-errors дозволяє створювати помилки з потрібним статусом і повідомленням.

### npm i celebrate

"Бібліотеки валідації, Дві найпопулярніші бібліотеки для цього:
Joi — мова опису схем об’єктів і валідатор.
celebrate — дозволяє інтегрувати Joi безпосередньо у маршрути Express.
Бібліотека celebrate вже містить Joi, тому достатньо встановити тільки її:"

### // npm i bcrypt

У Node.js найчастіше застосовують бібліотеку bcrypt, яка спеціально створена для безпечного хешування паролів. Вона додає до паролю сіль (salt) — випадковий рядок, що робить хеш унікальним навіть для однакових паролів.

### // npm i cookie-parser

Налаштовуємо парсер кук (Cookies)

### // npm install nodemailer

бібліотека nodemailer: функціонал відправлення листів

### // npm i jsonwebtoken

бібліотека для роботи з токен JWT

### // npm install mailgun.js

бібліотека mailgun: функціонал відправлення листів

### // npm i handlebars

популярний шаблонізатор для JavaScript (для створення листа, з гарним форматуванням, замість шаблонного рядку)

### // npm i multer

middleware multer для завантаження зображень (наприклад, аватарка)

### // npm install cloudinary

хмарний сервіс для керування зображеннями та відео

## ---------------------------

## // npm init @eslint/config@latest

```javascript
@eslint/create-config: v2.0.0
√ What do you want to lint? · javascript
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No
√ Where does your code run? · node
i The config that you've selected requires the following dependencies:
eslint, @eslint/js, globals
√ Would you like to install them now? · Yes
√ Which package manager do you want to use? · npm
```

# ==== 05-mail-and-img =====

У цьому завданні ви продовжите розробку свого Express-додатку (у тому ж репозиторії nodejs-hw). Цього разу ви реалізуєте скидання паролю через пошту, а також завантаження зображення для аватара користувача.

## ===== Критерії приймання =====

Завдання виконано у гілці 05-mail-and-img
Надано посилання на репозиторій із вихідним кодом на GitHub
Надано посилання на задеплоєний проєкт на render.com
Код працює без помилок
Сервер успішно підключається до MongoDB
Усі чутливі дані зберігаються у .env через змінні

```javascript
(PORT,
  MONGO_URL,
  JWT_SECRET,
  FRONTEND_DOMAIN,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  SMTP_PORT,
  SMTP_HOST,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM);
```

Реалізована обробка неіснуючих маршрутів (404)
Реалізована обробка помилок сервера (500 або специфічні помилки через http-errors)
Файлова структура відповідає вимогам (див. нижче)

## ===== Скидання паролю через email =====

### Налаштування пошти

Створіть акаунт на brevo.com. Цей сервіс буде використаний для надсилання повідомлень електронною поштою.

Підключіться до SMTP-сервера Brevo за допомогою пакету nodemailer.

Альтернативний SMTP:
Якщо у вас виникають проблеми з реєстрацією або підтвердженням акаунта в Brevo, ви можете використати SendGrid з безкоштовним планом протягом 2міс (цього достатньо для навчання). Код проєкту змінювати не потрібно — достатньо замінити значення SMTP-змінних у файлі .env.

### Надсилання email для скидання паролю

Створіть роут POST /auth/request-reset-email, який буде надсилати email для скидання паролю. В body він має приймати емейл користувача (властивість email).

#### Обробка цього роута має включати:

1. Опис роута POST /auth/request-reset-email у файлі src/routes/authRoutes.js.

2. Для маршруту POST /auth/request-reset-email потрібно валідувати тіло запиту як об’єкт із наступними властивостями:

email - рядок типу email, обов’язкове поле. 3. Для цього створіть схему валідації requestResetEmailSchema у файлі src/validations/authValidation.js.

4. Опис контролера requestResetEmail для цього роута у файлі src/controllers/authController.js:

Знайдіть користувача за переданим email. Якщо користувача не знайдено, то поверніть відповідь зі сатусом 200 і повідомленням:

```javascript
{
  message: 'Password reset email sent successfully';
}
```

Згенеруйте JWT-токен, який містить sub (id користувача) та email. Термін життя токена — 15 хвилин.
Зробіть HTML-лист на основі шаблону src/templates/reset-password-email.html (використовуйте handlebars для підстановки даних, таких як ім’я користувача та посилання).
Посилання в листі має вести на фронтенд (домен береться з env-змінної FRONTEND_DOMAIN) та мати вигляд:

```javascript
<FRONTEND_DOMAIN>/reset-password?token=<jwt-token>
```

Використайте утиліту sendEmail з файлу src/utils/sendMail.js для надсилання листа з посиланням для скиду паролю. В цій утиліті за допомогою пакету nodemailer організуйте відправку емейла користувачу.
Якщо надсилання листа не вдалося, то використовуючи бібліотеку createHttpError поверніть відповідь зі сатусом 500 і повідомленням

```javascript
'Failed to send the email, please try again later.';
```

У разі успіху поверніть відповідь зі статусом 200 і повідомленням:

```javascript
{
  message: 'Password reset email sent successfully';
}
```

Усі чутливі дані, які використовуються при цьому винесіть у файл .env:

```javascript

# Значення беремо із акаунта Brevo
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# Пошта на яку реєстрували акаунт brevo.com
SMTP_FROM=

# Довільний рядок для генерації підпису токена
JWT_SECRET=

# Домен фронтенда на який буде вести посилання в листі
# Наприклад http://localhost:3001
FRONTEND_DOMAIN=
```

### Скидання паролю

Створіть роут POST /auth/reset-password, який буде скидати пароль. В body він має приймати:

властивість token - JWT токен, який був переданий у посилання для скиду паролю в попередньому кроці;
властивість password - новий пароль.

#### Обробка цього роута має включати:

1. Опис роута POST /auth/reset-password у файлі
   src/routes/authRoutes.js.

2.Для маршруту POST /auth/reset-password потрібно валідувати тіло запиту як об’єкт із наступними властивостями:

```javascript
password - рядок, обов’язкове поле;
token - рядок, обов’язкове поле;
```

3. Для цього створіть схему валідації resetPasswordSchema у файлі
   src/validations/authValidation.js.

4. Опис контролера resetPassword для цього роута у файлі
   src/controllers/authController.js:

Верифікуйте отриманий в тілі запиту jwt-токен. Якщо токен невалідний або прострочений, використовуючи бібліотеку createHttpError, поверніть відповідь зі статусом 401 і повідомленням

```javascript
'Invalid or expired token'.
```

Знайдіть користувача за sub та email, які містяться в токені. Якщо користувача не знайдено, використовуючи бібліотеку createHttpError, поверніть відповідь зі статусом 404 і повідомленням

```javascript
'User not found'.
```

Зашифруйте новий пароль за допомогою бібліотеки bcrypt.
Оновіть пароль користувача в базі даних.
У разі успіху поверніть відповідь зі статусом 200 та повідомленням:

```javascript
{
  message: 'Password reset successfully';
}
```

## ===== Аватар користувача =====

Розширте функціонал вашого серверу, додавши можливість завантажувати зображення для аватарки користувача.

### Налаштування Cloudinary

Створіть акаунт на Cloudinary.

У .env винесіть налаштування для Cloudinary:

```javascript
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Модель користувача

У модулі User в файлі src/models/user.js додайте поле avatar. Тип String, необов’язкове поле, дефолтне значення:

```javascript
https://ac.goit.global/fullstack/react/default-avatar.jpg
```

За допомогою хука pre("save") налаштуйте, щоб значення властивості username автоматично встановлювалося таким самим, як у email.

### Завантаження аватара

Створіть роут PATCH /users/me/avatar, який буде оновлювати аватар користувача. В body він має приймати:

```javascript
властивість avatar - файл із зображенням для аватарки користувача.
```

#### Обробка цього роута має включати:

1. Реєстрацію загального роута користувача в файлі src/server.js.

2. Опис роута PATCH /users/me/avatar у файлі src/routes/userRoutes.js.

3. Для маршруту PATCH /users/me/avatar потрібно:
   реалізувати захист маршруту, щоб до нього доступ був тільки у авторизованого користувача
   обробити файл із зображенням для аватарки користувача через middleware upload.

Для цього створіть middleware upload у файлі src/middleware/multer.js, який:
зберігає файл у пам’яті (memoryStorage);
обмежує розмір файлу до 2MB;
дозволяє тільки файли з mimetype, що починається з image/. У випадку невідповідності повертає помилку "Only images allowed".

4. Реалізацію утиліти для збереження файлу в хмарне сховище у файлі src/utils/saveFileToCloudinary.js:
   використайте бібліотеку cloudinary;
   реалізуйте функцію saveFileToCloudinary(buffer, userId), яка приймає буфер файлу та повертає проміс, який виконається із об’єктом даних завантаженого зображення;
   завантаження організуйте через cloudinary.uploader.upload_stream.

5. Опис контролера updateUserAvatar для цього роута у файлі src/controllers/userController.js:

Перевірте наявність файлу у реквесті, у разі його відсутності, використовуючи бібліотеку createHttpError, поверніть відповідь зі статусом 400 і повідомленням 'No file'.
Використайте утиліту saveFileToCloudinary, щоб завантажити файл у Cloudinary;
Оновіть поле avatar користувача в базі даних, використовуючи отримане secure_url;
У разі успіху поверніть відповідь зі статусом 200 та об’єктом:

```javascript
{
  url: посилання_на_аватар;
}
```

## ===== Деплой =====

Задеплойте ваш додаток з гілки 05-mail-and-img на render.com.
