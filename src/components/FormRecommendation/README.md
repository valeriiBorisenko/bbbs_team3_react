# FormRecomendation

Форма, используется на странице "Куда пойти" (Places).

### Пропсы:
- **isOpen** - boolean, флаг того, что форма открыта
- **onSubmit** - function, функция-обработчик сабмита формы
- **activityTypes** - arrayOf(objects), массив типов отдыха с полями 'id' и 'name'
- **isWaitingResponse** - boolean, флаг того, что идёт запрос на сервер (меняется текст кнопки и сама она становится disabled)
