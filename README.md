# RPI relay controller

## Требования

* Плата: Raspberry Pi;
* OS: Raspbian;
* Флеш-память: 8GB microSD 10 класса;

## Установка и настройка

1. Установите необходимые зависимости

```{sh}
sudo apt-get update && sudo apt-get upgrade
sudo apt install apache2-utils -y
sudo apt install git -y
sudo apt-get install apt-transport-https ca-certificates software-properties-common -y
```

2. Установите docker и docker-compose

```{sh}
curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
sudo sh /tmp/get-docker.sh
sudo usermod -aG docker pi
docker version
sudo pip3 install docker-compose
```

3. Выкачайте ветку проекта в домашнюю директорию

```{sh}
git clone https://github.com/timeflow-one/rpi-relay-controller.git
```

4. Перейдите в директорию с проектом

```{sh}
cd ~/rpi-relay-controller
```

### Конфигурационный файл релейного модуля

1. Выполните скрипт конфигурации для вашего релейного модуля

   * Конфигурация для 8и релейного модуля:

```{sh}
echo '[5,6,13,16,19]' > config/available_relays.json
```

   * Конфигурация для 3х релейного модуля:

```{sh}
echo '[]' > config/available_relays.json
```

   * Конфигурация для 4х релейного модуля:

```{sh}
echo '[]' > config/available_relays.json
``` 

2. Выполните конфигурацию замков (формат конфигурации замка в **Приложении 1**)

```{sh}
cp config/available_locks.example.json config/available_locks.json
nano config/available_locks.json
```

### Установка приложения

1. Настройте логин и пароль для доступа к контроллеру

```{sh}
sh scripts/credentials.sh
```

2. Выполните сборку контейнеров

```{sh}
docker-compose -f docker-compose.yml build
```

### Запуск приложения

Запустите приложение, выполнив команду

```{sh}
docker-compose -f docker-compose.yml up
```

## API

#### POST `/lock/open`

*Запрос на открытие двери*

Заголовки:

* Authorization: Basic *TOKEN*
* Content-Type: application/json

JSON-тело запроса:

| Параметр  | Тип    | Описание                             |
|-----------|:------:|--------------------------------------|
| source    | строка | Название объекта (проходного пункта) |
| initiator | строка | Инициатор запроса                    |

Примеры ответов:

**200 OK**
```{json}
{
  "data": {
    "source": "sample-source",
    "initiator": "sample-initiator",
    "timestamp": "2020-06-22T11:58:44Z" // ISO 8601
  }
}
```


**Запрос, выполненный с ошибкой**
```{json}
{
  "error": {
    "name": "error-title",
    "detail": "error-detail"
  }
}
```

## Приложение 1. Формат конфигурации замка

Типы замков:

* `direct`:
   * Электромагнитный;
   * Электромеханический;
* `composite`:
   * Электромоторный;

Формат конфигурации замка:

```{json}
{
  "destination": "destination-name", // название объекта, как в сервисе Timeflow
  "type": "direct", // см. Приложение 1: Типы замков
  "enabled": true, // флаг доступности контроллера
  "timeout": 3000, // таймаут, спустя который замок будет закрыт
  "relays": [ // список реле, с которыми работает замок
    {
      "direction": 0, // направление реле. 0 - открытие, 1 - закрытие. Для типа direct всегда 0
      "relay": {
        "gpio": 23 // номер gpio, с которым работает реле
      }
    }
  ]
}
```
