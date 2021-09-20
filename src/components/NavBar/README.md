# NavBar

Основное навигационное меню в Header сайта.

### Пропсы:

- **isMobileMenuOpen** - boolean, флаг того, что открыто мобильное меню
- **onUserButtonClick** - function, функция-обработчик клика по иконке пользователя
- **onBurgerButtonClick** - function, функция-обработчик клика по бургеру
- **onCityChangeClick** - function, функция-обработчик клика по кнопке "Изменить город"
- **onLogout** - function, функция-обработчик клика по кнопке "Выйти"
- **userCityName** - string, город пользователя
- **setIsMobileMenuOpen** - function, для решения конфликта открытого поиска одновременно с бургер меню
- **isOpenSearch** - boolean, преднозначен для контроля состояния поиска открыт/закрыт, дефолт false
- **setIsOpenSearch** - function, преднозначен для переключения состояния поиска открыт/закрыт
