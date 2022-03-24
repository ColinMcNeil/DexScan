<script lang="ts">
  import Path from "./components/Path.svelte";
  import { parseRoute, runScan } from "./lib/runScan";

  let args = {
    srcToken: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    destToken: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    amount: "1000000",
    srcDecimals: 6,
    destDecimals: 18,
    side: "SELL",
    network: 137,
    otherExchangePrices: true,
  };

  let items = [];

  let loading = false;

  const runOnce = () => {
    loading = true;
    const item = runScan(args).then(parseRoute);
    item.then((i) => {
      if (i.error) {
        loading = false;
        return alert(i.error);
      }
      items = [...items, i];
      loading = false;
    });
  };
  const updateForm = (e: Event) => {
    const target = e.target as HTMLInputElement;
    args[target.id] = target.value;
  };
</script>

<main id="dexscan">
  <h1>DexScan</h1>
  <div class="actions">
    <div class="block address">
      <h2>Source</h2>
      <input
        id="srcToken"
        type="text"
        placeholder="Address"
        value={args.srcToken}
        on:change={updateForm}
      />
      <input
        id="srcDecimals"
        type="number"
        value={args.srcDecimals}
        placeholder="Decimals"
        on:change={updateForm}
      />
    </div>
    <div class="block address">
      <h2>Target</h2>
      <input
        id="destToken"
        type="text"
        placeholder="Address"
        value={args.destToken}
        on:change={updateForm}
      />
      <input
        id="destDecimals"
        type="number"
        value={args.destDecimals}
        placeholder="Decimals"
        on:change={updateForm}
      />
    </div>
    <div class="block others">
      <select id="side" on:change={updateForm}>
        <option value="SELL">SELL</option>
        <option value="BUY">BUY</option>
      </select>
      <input
        id="amount"
        type="text"
        placeholder="Amount"
        value={args.amount}
        on:change={updateForm}
      />
      <input
        id="network"
        type="number"
        placeholder="Network"
        value={args.network}
        on:change={updateForm}
      />
    </div>
    <div class="runActions">
      <button id="run" on:click={runOnce}
        >{loading ? "Loading..." : "Run Price"}</button
      >
      <button id="startstop">Run Repeat</button>
      <input id="wait" type="number" value="500" placeholder="500" />
      <span>ms</span>
    </div>
    <button id="export">Export CSV</button>
  </div>
  <div id="output">
    <div class="row header">
      <div>timestamp</div>
      <div>resp time</div>
      <div>worst deal</div>
      <div>worst dex</div>
      <div>best deal</div>
      <div>best dex</div>
    </div>
    {#each items as item}
      <div class="row item">
        <div>{item.timestamp}</div>
        <div>{item.respTime}</div>
        <div>{(item.worstAmount / 10 ** args.destDecimals).toFixed(2)}</div>
        <div><Path routes={item.worstExchange} /></div>
        <div>{(item.bestAmount / 10 ** args.destDecimals).toFixed(2)}</div>
        <div><Path routes={item.bestExchanges} /></div>
      </div>
    {/each}
  </div>
</main>

<style>
  h1 {
    margin: 0;
    border-bottom: solid rgb(148, 148, 148) 1px;
    padding-bottom: 10px;
  }
  button {
    font-size: 1.5em;
    outline: none;
    border: none;
    border-radius: 5px;
    background-color: rgb(83, 179, 83);
  }
  input,
  select {
    background-color: rgba(255, 255, 255, 0.2);
    outline: none;
    border: none;
    border-radius: 5px;
    font-size: inherit;
    padding: 5px;
    color: white;
    box-sizing: border-box;
  }
  select {
    font-weight: bold;
  }
  .actions,
  h1 {
    margin: 10px 30px;
  }
  .runActions {
    margin: 10px 0;
    display: flex;
    align-items: center;
  }
  .runActions > * {
    margin-right: 5px;
  }
  button:hover {
    cursor: pointer;
    background-color: rgb(92, 221, 92);
  }
  .block {
    padding: 5px;
    margin: 15px 0;
    border-radius: 5px;
  }
  .address {
    background-color: rgb(92, 45, 136);
  }
  .others {
    background-color: rgb(45, 100, 136);
  }
  h2 {
    margin: 5px 0 10px 5px;
  }
  #output {
    display: flex;
    flex-wrap: wrap;
    background-color: rgb(102, 91, 206);
    max-width: 100vw;
    margin-top: 20px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    color: white;
    max-width: 100vw;
    flex: 0 0 100%;
  }
  .row.header {
    font-weight: bold;
  }
  .row > div {
    background-color: rgb(81, 71, 172);
    padding: 5px;
    flex: 1 1 100%;
    max-width: 140px;
    margin: 5px;
    border-radius: 5px;
    word-break: break-all;
    text-align: center;
  }
</style>
