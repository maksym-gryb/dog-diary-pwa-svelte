<script lang="ts">
  let { size = 24 } = $props<{
    message?: string;
    size?: number;
  }>();

</script>

<div class="wrapper" role="status" aria-live="polite">
  <div class="spinner" style="width: {size}px; height: {size}px;"></div>
</div>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .spinner {
    border: 3px solid rgb(100, 149, 237, 0.15);
    border-top-color: rgba(100, 149, 237, 0.7);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>