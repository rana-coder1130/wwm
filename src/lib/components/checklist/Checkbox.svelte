<script lang="ts">
  let { checked = false, onToggle = () => {} } = $props<{
    checked?: boolean;
    onToggle?: () => void;
  }>();

  function handleChange(event: Event) {
    // prevent parent handlers from also firing when clicking the input
    event.stopPropagation();
    onToggle();
  }
</script>

<label class="container">
  <input type="checkbox" checked={checked} onclick={handleChange} />
  <svg viewBox="0 0 64 64" height="1.25em" width="1.25em" aria-hidden="true">
    <path
      d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
      pathLength="575.0541381835938"
      class="path"
    ></path>
  </svg>
</label>

<style>
  .container {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* keep a fixed size so surrounding text alignment stays stable */
    width: 1.25em;
    height: 1.25em;
    flex: 0 0 auto;
  }

  .container input {
    display: none;
  }

  .container svg {
    overflow: visible;
    display: block;
  }

  .path {
    fill: none;
    stroke: rgb(0, 0, 0);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
    stroke-dasharray: 241 9999999;
    stroke-dashoffset: 0;
  }

  .container input:checked ~ svg .path {
    stroke-dasharray: 70.5096664428711 9999999;
    stroke-dashoffset: -262.2723388671875;
  }
</style>
