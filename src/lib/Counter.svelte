<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { browser } from '$app/environment';
  import { prefersReduced, onEnter } from './motion.js';

  export let to = 100;
  export let decimals = 0;
  export let suffix = '';
  export let prefix = '';

  const value = tweened(0, { duration: 1500, easing: cubicOut });
  let host;

  onMount(() => {
    if (!browser) return;
    if (prefersReduced()) { value.set(to, { duration: 0 }); return; }
    return onEnter(host, () => value.set(to));
  });

  $: display = $value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
</script>

<span bind:this={host} class="counter">{prefix}{display}{suffix}</span>

<style>
  .counter { font-variant-numeric: tabular-nums; }
</style>
