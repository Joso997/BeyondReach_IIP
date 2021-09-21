<template>
  <div
    class="cyber-card"
    :id="id"
    :draggable="draggable"
    @dragstart="DragStart"
    @dragover.stop
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class CyberCard extends Vue {
    @Prop({ default: -1 }) private id!: number;
    @Prop() private draggable!: [];

    public DragStart (event) {
      const target = event.target
      event.dataTransfer.setData('cardid', target.id)
      setTimeout(() => {
        target.style.display = 'none'
      }, 0)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }

</style>
