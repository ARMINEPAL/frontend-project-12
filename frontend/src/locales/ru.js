export default {
  translation: {
    languages: {
      ru: 'Русский',
    },
    fields: {
      username: 'Имя пользователя',
      name: 'Ваш ник',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
    },
    buttons: {
      login: 'Войти',
      registration: 'Регистрация',
      logout: 'Выйти',
      signup: 'Зарегистрироваться',
      submit: 'Подтвердить',
      add: '+',
      send: 'Отправить',
      remove: 'Удалить',
      rename: 'Переименовать',
    },
    loginPage: {
      noAccount: 'Нет аккаунта?',
    },
    chatPage: {
      labels: {
        forMessages: 'Введите сообщение',
        manageOfChannel: 'Управление каналом',
      },
      modal: {
        add: {
          header: 'Имя канала',
        },
      },
      header: 'Каналы',
      messagesCount: {
        count_one: '{{count}} сообщение',
        count_few: '{{count}} сообщения',
        count_many: '{{count}} сообщений',
      },
      channel: {
        add: 'Добавить канал',
        remove: 'Удалить канал',
        rename: 'Переименовать канал',
      },
    },
    errors: {
      required: 'Обязательное поле',
      minMax: 'От 3 до 20 символов',
      passwordsMustMatch: 'Пароли должны совпадать',
      userExists: 'Такой пользователь уже существует',
      incorrectFields: 'Неверные имя пользователя или пароль',
      network: 'Ошибка соединения',
      unique: 'Название должно быть уникальным',
      passwordLength: 'Не менее 6 символов',
    },
    notifications: {
      add: 'Канал создан',
      delete: 'Канал удалён',
      rename: 'Канал переименован',
    },
    notFound: {
        title: 'Страница не найдена',
        text: 'Но вы можете перейти',
        link: 'на главную страницу',
    }
  },
};
