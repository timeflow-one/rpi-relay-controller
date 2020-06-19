# Raspberry ACS controller

## Требования

* Плата: Raspberry Pi;
* OS: Raspbian;
* Флеш-память: 8GB microSD 10 класса;

## Установка и настройка

1. Установите необходимые зависимости

```{sh}
sudo apt-get update && sudo apt-get upgrade
sudo apt install apache2-utils -y
sudo apt install git -y2
sudo apt-get install apt-transport-https ca-certificates software-properties-common -y
```

2. Установите docker

```{sh}
curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
sudo sh /tmp/get-docker.sh
sudo usermod -aG docker pi
docker version
```

3. Выкачайте ветку проекта в домашнюю директорию

```{sh}
git clone https://github.com/nionoku/rpi-relay-controller
```

4. Перейдите в директорию с проектом

```{sh}
cd ~/rpi-relay-controller
```

### Конфигурационный файл релейного модуля

1. Получение конфигурационного файла для релейного модуля
<!-- TODO получение конфигурационного файла для каждого релейного модуля -->

2. Конфигурация замков

Формат конфигурации замка:

<!-- или electric (электромоторный, недоступен) -->
<!-- Для электромоторного - одно реле на открытие, второе - на закрытие -->
```{json}
{
  "source": "source-name", // название объекта, как в сервисе Timeflow
  "type": "electromagnetic", // тип замка: electromagnetic (электромагнитный), electromechanical (электромеханический)
  "enabled": true, // флаг доступности контроллера
  "timeout": 3000, // таймаут, спустя который замок будет закрыт
  "relays": [ // список реле, с которыми работает замок
    {
      "direction": 0, // направление реле. 0 - открытие, 1 - закрытие. Для электромагнитного и электромеханического всегда 0
      "relay": {
        "gpio": 23 // номер gpio, с которым работает реле
      }
    }
  ]
}
```

Выполните конфигурацию замков

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

## Тестовый доступ

Для тестирования замков выполните следующую скрипт:

```{sh}
sh scripts/test.sh
```

<!-- ## Пользовательский интерфейс -->

## API
