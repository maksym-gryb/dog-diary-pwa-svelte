<script>
    import { goto } from "$app/navigation";
    import { login } from "$lib/auth";

    async function handleLogin() {
      const user = await login();

      if (user) {
        goto("/profile");
      }
    }
</script>

<button onclick={handleLogin}>
    Sign in with Google
</button>
