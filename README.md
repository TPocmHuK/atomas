# Atomas

HTML5-клон головоломки Atomas.

Весь играбельный код лежит в [`web/`](./web/). Сборщики не нужны — это чистые HTML/CSS/JS + Canvas. Подробности по запуску, упаковке архива для Яндекса и интеграции YSDK — в [`web/README.md`](./web/README.md).

## Быстрый старт

```bash
cd web
python3 -m http.server 8080
# открыть http://localhost:8080
```

## Сборка ZIP для загрузки

```bash
cd web
zip -r ../atomas-yandex.zip . -x "README.md" "*.DS_Store"
```
