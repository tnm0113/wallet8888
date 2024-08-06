### HOW TO RUN

1.  Install nvm, nodejs
2.  Clone project

```bash
git clone https://github.com/tnm0113/wallet8888.git
```

3.  Install ts-node and npm package:

```bash
npm install -g ts-node
npm install
```

4.  Copy file .env and edit option you want

```bash
cp .env.default .env
```

5.  Run on screen:

```bash
screen -dRR generate
npm start
```

Press Ctrl + A + D for detach screen

### HOW TO IMPORT

Get the seed on file result, import to wallet for each type, eg: Rabby, Substrate, Petra

### NOTE

You should run it on VPS, because it takes long time to get the one we want
