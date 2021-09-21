<template>
  <div
    class="cyber-card"
    :id="id"
    :draggable="draggable"
    @dragstart="DragStart"
    @dragover.stop
  >
    <b-card
      bg-variant="primary"
      text-variant="white"
      class="text-center mt-3"
    >
      <template v-slot:header>
        <slot name="header" />
      </template>
      <b-list-group flush>
        <b-input-group>
          <div class="flex-fill">
            <b-form-input
              readonly
              value="Action"
              class="text-center"
            />
            <b-form-select
              v-model="phaseList[2]"
              :options="optionsActionType"
            />
          </div>
        </b-input-group>
        <b-input-group class="mt-3">
          <div class="flex-fill">
            <b-form-input
              readonly
              value="Repeat"
              class="text-center panel panel-default panel-modest"
            />
            <b-form-input
              v-model="phaseList[3]"
              type="number"
              min="0"
              max="100"
            />
          </div>
        </b-input-group>
        <b-button
          class="mt-3"
          type="button"
          @click="Save"
        >
          Save
        </b-button>
      </b-list-group>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DBFile from '../types/DBFile'
@Component
export default class CyberCard extends Vue {
    @Prop({ default: -1 }) private id!: number;
    @Prop() private draggable!: [];
    @Prop({ default: 'Error' }) private header!: string;
    @Prop() private phase!: [number, string, string, number, number, [], []];
    @Prop() private editDelegate!: DBFile;
    private phaseList = [];

    private optionsActionType = [
      { value: 'Dialogue', text: 'Dialogue' },
      { value: 'Course', text: 'Course' },
      { value: 'Avoid', text: 'Avoid' },
      { value: 'Hack', text: 'Hack' }
    ];

    public created () {
      this.phaseList = this.phase.slice(0)
    }

    public DragStart (event) {
      event.dataTransfer.setData('cardid', event.target.id)
    }

    public Save () {
      this.editDelegate.DBFileGetData(`UPDATE EventPhase SET EndingCondition = '${this.phaseList[2]}', RepeatNumber = ${this.phaseList[3]} WHERE Code = ${this.phase[0]}`)
      this.$forceUpdate()
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
