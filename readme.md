# GET

## with onReq provided `SUCCESS`
```bash
curl --insecure https://127.0.0.1:3002
```

## without onReq provided `FAILURE`
```bash
curl --insecure https://127.0.0.1:3003
```


# POST
## application/json

### Proxied `FAILURE`
```bash
curl --insecure -H "Content-Type: application/json" -d "{\"test\": \"value\"}" https://127.0.0.1:3002/
```

### Not proxied `SUCCESS`
```bash
curl --insecure -H "Content-Type: application/json" -d "{\"test\": \"value\"}" http://127.0.0.1:3009/
```

## text/html

### Proxied `SUCCESS`
```bash
curl --insecure -d "plain text" https://127.0.0.1:3002/
```