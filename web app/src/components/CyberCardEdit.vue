<template>
  <div class="cyber-card-edit">
    <b-card no-body>
      <template v-slot:header>
        {{ canSave }}
        <b-button
          class="primary"
          @click="AddConsequence"
        >
          +
        </b-button>
      </template>
      <b-list-group flush>
        <b-input-group>
          <b-form-input
            readonly
            value="Probability"
            class="text-center"
          />
          <b-form-input
            readonly
            value="ObjectType"
            class="text-center"
          />
          <b-form-input
            readonly
            value="DamageType"
            class="text-center"
          />
          <b-form-input
            readonly
            value="Severity"
            class="text-center"
          />
        </b-input-group>
        <b-input-group
          class="mt-3"
          v-for="(consequence, idConsequence) in getConsequence"
          :key="idConsequence"
        >
          <b-form-input
            v-model="consequence[2]"
            type="number"
            min="0"
            max="100"
          />
          <b-form-select
            v-model="consequence[3]"
            :options="optionsObjectType"
          />
          <b-form-select
            v-model="consequence[4]"
            :options="optionsDamageType"
          />
          <b-form-select
            v-model="consequence[5]"
            :options="optionsSeverity"
          />
          <b-input-group-append>
            <b-button
              variant="danger"
              @click="RemoveConsequence(consequence)"
            >
              -
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-list-group>
      <b-card-body>
        <b-form-textarea
          id="textarea"
          :value="getDialogue"
          @change="setDialogue"
          placeholder="Add Dialogue"
          rows="3"
          max-rows="6"
        />
      </b-card-body>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DBFile from '../types/DBFile'
import Phase from '../types/Phase'

@Component
export default class CyberCardEdit extends Vue {
    @Prop({ default: -1 }) private idValue!: string;
    @Prop({ default: 'Error' }) private header!: string;
    @Prop({ type: Object as () => Phase }) private phase!: Phase;
    @Prop() private editDelegate!: DBFile;
    @Prop({ default: false }) private canSave!: boolean;
    private textDialogue = '';
    private consequenceList = [];
    private consequenceListToDelete = [];

    private optionsObjectType = [
      { value: 'Reactor', text: 'Reactor' },
      { value: 'Stasis', text: 'Stasis' }
    ];

    private optionsDamageType = [
      { value: 0, text: '0' },
      { value: 1, text: '1' },
      { value: 2, text: '2' }
    ];

    private optionsSeverity = [
      { value: 90, text: '90' },
      { value: 75, text: '75' },
      { value: 50, text: '50' },
      { value: 25, text: '25' }
    ];

    public mounted () {
      if (this.phase.dialogue.length > 0) {
        this.textDialogue = this.phase.dialogue[0][2]
      }
      if (this.phase.consequence.length > 0) {
        this.phase.consequence.forEach((element) => {
          this.consequenceList.push(element.slice(0))
        })
      }
    }

    public beforeDestroy () {
      if (this.canSave) {
        this.Save()
      }
    }

    get getConsequence () {
      return this.consequenceList
    }

    get getDialogue () {
      return this.textDialogue
    }

    public setDialogue (value) {
      this.textDialogue = value
    }

    public Save () {
      console.log(this.consequenceList)
      this.editDelegate.DBFileGetData(
        `REPLACE INTO Dialogue(CodeEventPhase, Content) VALUES(${this.phase[0]}, '${this.textDialogue}')`
      )
      if (this.consequenceListToDelete.length > 0) {
        this.consequenceListToDelete.forEach((element) => {
          this.editDelegate.DBFileGetData(
            `DELETE FROM Consequence WHERE Code = ${element[0]}`
          )
        })
      }
      this.consequenceList.forEach((element) => {
        this.editDelegate.DBFileGetData(
          `REPLACE INTO Consequence (CodeEventPhase, Probability, ObjectType, DamageType, Severity)
          VALUES(${this.phase[0]}, '${element[2]}', '${element[3]}', '${element[4]}', '${element[5]}')`
        )
      })
    }

    public AddConsequence () {
      this.consequenceList.push([0, this.phase[0], 100, 'Reactor', 0, 50])
    }

    public RemoveConsequence (i) {
      this.consequenceList.splice(this.consequenceList.indexOf(i), 1)
      this.consequenceListToDelete.push(i)
      console.log(this.consequenceListToDelete)
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
