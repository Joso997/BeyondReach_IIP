<template>
  <div class="cyber-tab">
    <b-tab>
      <template v-slot:title>
        <b-badge variant="primary">
          {{ idValue }}
        </b-badge> <strong>{{ header }}</strong>
      </template>
      <slot name="cyber-options" />
      <slot />
    </b-tab>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class CyberTab extends Vue {
    @Prop({ default: -1 }) private idValue!: number;
    @Prop({ default: 'Error' }) private header!: string;
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
