<template>
  <b-card-group
    deck
    :id="id"
    class="cyber-card-group board"
    @dragover.prevent
    @drop.prevent="Drop"
  >
    <slot />
  </b-card-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class CyberModal extends Vue {
    @Prop({ default: -1 }) private id!: string;

    public Drop (event) {
      const cardid = event.dataTransfer.getData('card_id')
      const card = document.getElementById(cardid)

      card.style.display = 'block'

      event.target.appendChild(card)
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
