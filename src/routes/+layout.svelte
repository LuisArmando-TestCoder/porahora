<script>
  import Header from "$lib/ui/organisms/Header.svelte";
  import { user as userStore } from "$lib/stores/user.js";
  export let data;
  import { onMount } from "svelte";

  // Set the global user store when the prop changes
  $: userStore.set(data.user);

  onMount(() => {
    console.log("Hi, Global")
  });
</script>

<Header />
<slot />
