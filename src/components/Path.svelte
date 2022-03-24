<script lang="ts">
  export let routes = null;
  export let args = {};
  console.log(routes);
</script>

<main class="routes">
  {#if routes === null}
    {null}
  {:else}
    <span class="route"> Start </span>
    {#each routes.flat() as route}
      ⬇️
      <span class="route">
        {route.exchange}
        ${parseFloat(route.data.gasUSD).toFixed(2)}
      </span>
    {/each}
  {/if}
</main>

<style>
  .routes {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
  .route {
    background-color: rgb(0, 133, 126);
    margin: 5px;
    border-radius: 10px;
    padding: 2px 5px;
    font-size: 0.8em;
    flex: 1 1 100%;
  }
</style>
