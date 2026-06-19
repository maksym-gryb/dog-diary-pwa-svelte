<script lang="ts">
  let { data } = $props();

  function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString();
  }
</script>

<svelte:head>
  <title>Dog Activities</title>
</svelte:head>

<h1>Dog Activities</h1>

{#if data.activities.length === 0}
  <p>No activities found.</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Activity</th>
        <th>Date & Time</th>
      </tr>
    </thead>
    <tbody>
      {#each data.activities as activity}
        <tr>
          <td>{activity.activity}</td>
          <td>{formatDateTime(activity.datetime)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  h1 {
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.75rem;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    font-weight: bold;
  }
</style>