const BASE_URL = "https://apiv5.paraswap.io/prices/";

const generateURL = (params) => {
  let builtURL = `${BASE_URL}?`;
  for (const key of Object.keys(params)) {
    builtURL = builtURL += `&${key}=${params[key]}`;
  }
  return builtURL;
};

const fetchData = async (url) => {
  const start = new Date().getTime();
  const resp = await fetch(url).then((d) => d.json());
  if (resp.error) {
    alert(resp.error);
  }
  const end = new Date().getTime();
  return {
    time: end - start,
    resp,
  };
};

export const runScan = (params) => {
  return new Promise((res, rej) => {
    try {
      fetchData(
        generateURL({
          ...params,
          side: "BUY",
          amount: params.amount * 10 ** params.destDecimals,
        })
      ).then((dataBuy) => {
        console.log(dataBuy);
        fetchData(
          generateURL({
            ...params,
            side: "SELL",
            srcToken: params.destToken,
            destToken: params.srcToken,
            srcDecimals: params.destDecimals,
            destDecimals: params.srcDecimals,
            amount: dataBuy.resp.priceRoute.destAmount,
          })
        ).then((dataSell) => {
          console.log({ dataBuy, dataSell });
          res({ dataBuy, dataSell });
        });
      });
    } catch (e) {
      rej(e);
    }
  });
};

export const parseRoute = ({ dataBuy, dataSell }) => {
  return {
    timestamp: new Date().toLocaleString().replace(",", ""),
    respTime: `Buy: ${dataBuy.time}ms, Sell: ${dataSell.time}`,
    buyUSD: `${dataBuy.resp.priceRoute.srcUSD}`,
    sellUSD: `${dataSell.resp.priceRoute.destUSD}`,
  };
};
