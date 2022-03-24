<script lang="ts">
  export const exchange = null;
  console.log(exchange);
</script>

<main class="row">
  {#if exchange}
    <span class="item">{exchange.exchange}</span>
  {:else}
    <p>Loading!</p>
  {/if}
</main>

<style>
</style>
