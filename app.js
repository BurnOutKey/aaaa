const fetch = require("node-fetch");

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const send = async (url, amount, res) => {
  let requests = [];

  for (let i = 0; i < amount; i++) {
    requests.push(
      fetch(url)
        .then((req) => req.ok)
        .catch(() => false)
    );
  }

  const results = await Promise.allSettled(requests);

  let success = results.filter(result => result.status === "fulfilled" && result.value === true).length;
  let failed = results.filter(result => result.status === "rejected" || result.value === false).length;

  res.send(`${failed}?${success}/${amount}`);
};

app.get("/ping", async (req, res) => {
  let { url, amount } = req.query;

  if (url && url.startsWith("http")) {
    amount = Number(amount);
    
    if(isNaN(amount) || amount < 1) amount = 1;

    send(url, amount, res);

    return;
  }

  return res.send(`wrong url`);
});

app.listen(port);
