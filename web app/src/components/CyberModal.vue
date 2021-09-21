<template>
  <div class="cyber-modal">
    <b-modal
      :id="idValue"
      title="BootstrapVue"
      ok-title="Save"
      @ok="Save(true)"
      @close="Save(false)"
      @cancel="Save(false)"
      @hidden="Save(false)"
    >
      <slot
        name="cyber-item"
        :canSave="check"
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DBFile from '../types/DBFile'

@Component
export default class CyberModal extends Vue {
  get getPhase () {
    return this.phase
  }

    public check = false;
    @Prop({ default: -1 }) private idValue!: string;
    @Prop({ default: 'Error' }) private header!: string;
    @Prop() private phase!: [];
    @Prop() private editDelegate!: DBFile;

    public Save (temp: boolean) {
      this.check = temp
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
