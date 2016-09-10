# Phising Noise

Feed nasty data to nasty phishers.

### Quick start

```
#!/bin/bash
export NOISE_TARGET_URL="http://badguys.com/badpost"
export NOISE_ORIGIN="http://badguys.com"
export NOISE_REFERER="http://badguys.com/badurl"
node ./lib/index.js
```

### Customize

You can customize the following options through environment variables:

```
NOISE_MAX_AMOUNT || 10 (number of sent requests)
NOISE_MAX_TIMEFRAME || 300 (in seconds)
```

You will probably also need to change how `data` is created.

You're welcome to use and modify this as you wish.

### Example run

```
Scheduling 6 requests during the next 152 seconds.

req: Email=eduarda%40googlemail.com&Senha=veste
res: 200 date=Sat, 10 Sep 2016 21:43:16 GMT, server=Apache
req: Email=miguel.pinto%40aol.com&Senha=comercialista
res: 200 date=Sat, 10 Sep 2016 21:43:37 GMT, server=Apache
req: Email=miguel.cardoso%40optusnet.com.au&Senha=vtexvtex
res: 200 date=Sat, 10 Sep 2016 21:44:14 GMT, server=Apache
req: Email=ana.campos%40xtra.co.nz&Senha=vtexvtex
res: 200 date=Sat, 10 Sep 2016 21:44:16 GMT, server=Apache
req: Email=davi%40gmail.com&Senha=iloveyou
res: 200 date=Sat, 10 Sep 2016 21:44:17 GMT, server=Apache
req: Email=pedro%40earthlink.net&Senha=tente
res: 200 date=Sat, 10 Sep 2016 21:45:17 GMT, server=Apache

Scheduling 9 requests during the next 141 seconds.

req: Email=livia.rodrigues%40gmail.com&Senha=vtex1
res: 200 date=Sat, 10 Sep 2016 21:45:31 GMT, server=Apache
req: Email=ana%40aol.com&Senha=hello123
res: 200 date=Sat, 10 Sep 2016 21:45:35 GMT, server=Apache
req: Email=enrico.moura%40sympatico.ca&Senha=vendas
res: 200 date=Sat, 10 Sep 2016 21:46:09 GMT, server=Apache
req: Email=rafael.dias%40globo.com&Senha=vendedora
res: 200 date=Sat, 10 Sep 2016 21:46:21 GMT, server=Apache
req: Email=maria.carvalho%40btinternet.com&Senha=vtex
res: 200 date=Sat, 10 Sep 2016 21:46:49 GMT, server=Apache
req: Email=eduardo.pinto%40gmail.com&Senha=senhavtex
res: 200 date=Sat, 10 Sep 2016 21:47:01 GMT, server=Apache
req: Email=lorena.cavalcanti%40icloud.com&Senha=123456
res: 200 date=Sat, 10 Sep 2016 21:47:25 GMT, server=Apache
req: Email=vicente.mendes%40xtra.co.nz&Senha=comerciar
res: 200 date=Sat, 10 Sep 2016 21:47:35 GMT, server=Apache
req: Email=lorenzo.ribeiro%40qq.com&Senha=tente
res: 200 date=Sat, 10 Sep 2016 21:47:35 GMT, server=Apache

Scheduling 4 requests during the next 118 seconds.

req: Email=melissa.monteiro%40aim.com&Senha=vendar
res: 200 date=Sat, 10 Sep 2016 21:47:57 GMT, server=Apache
req: Email=miguel.gomes%40xtra.co.nz&Senha=testa
res: 200 date=Sat, 10 Sep 2016 21:49:13 GMT, server=Apache
req: Email=arthur.souza%40me.com&Senha=comercialista
res: 200 date=Sat, 10 Sep 2016 21:49:30 GMT, server=Apache

Scheduling 2 requests during the next 300 seconds.

req: Email=murilo%40cox.net&Senha=testa
res: 200 date=Sat, 10 Sep 2016 21:49:48 GMT, server=Apache
```
