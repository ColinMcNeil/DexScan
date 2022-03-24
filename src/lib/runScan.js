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
      fetchData(generateURL(params)).then((data) => {
        console.log(data);
        res(data);
      });
    } catch (e) {
      rej(e);
    }
  });
};

export const parseRoute = (data) => {
  const bestSwaps = data.resp.priceRoute.bestRoute[0].swaps;
  const bestExchanges = data.resp.priceRoute.bestRoute[0].swaps.map(
    (swap) => swap.swapExchanges
  );
  const worstEchange = data.resp.priceRoute.others.sort(
    (a, b) => a.destAmount - b.destAmount
  )[0];
  return {
    timestamp: new Date().toLocaleString().replace(",", ""),
    respTime: data.time + "ms",
    worstAmount: parseInt(worstEchange.destAmount).toExponential(4),
    worstExchange: [worstEchange],
    bestAmount: parseInt(
      bestSwaps[bestSwaps.length - 1].swapExchanges[0].destAmount
    ).toExponential(4),
    bestExchanges,
  };
};
