<template>
  <div class="hello">
    <DatabaseInit @load-data-event="LoadData" />
    <h1>{{ msg }}</h1>
    <div class="container">
      <b-tabs
        :key="componentKey"
        content-class="mt-3"
      >
        <CyberTab
          v-for="(storyElement, id1) in getValues.story"
          :key="id1"
          :id-value="storyElement[0]"
          :header="storyElement[1]"
        >
          <template slot="cyber-options">
            <b-button
              v-if="id1 > 0"
              @click="RemoveStory(storyElement)"
            >
              Remove Story
            </b-button>
          </template>
          <b-tabs content-class="mt-3">
            <CyberTab
              v-for="(cyberEvent, id2) in storyElement.event"
              :key="id2"
              :id-value="cyberEvent[0]"
              :header="cyberEvent[1]"
            >
              <template slot="cyber-options">
                <b-button
                  v-if="id2 > 0"
                  @click="RemoveEvent(storyElement, cyberEvent)"
                >
                  Remove Event
                </b-button>
                <b-button @click="AddPhase(cyberEvent)">
                  Add Phase
                </b-button>
              </template>
              <draggable
                class="masonry"
                :list="cyberEvent.phase"
                @start="OnStart(cyberEvent.phase)"
                @change="OnChange"
                @end="OnEnd"
              >
                <CyberCard
                  class="m-3 masonry-brick"
                  v-for="(phase, id3) in cyberEvent.phase"
                  :key="id3"
                  :id="'phase'+phase[0]+'event'+cyberEvent[0]+storyElement[0]"
                  :phase="phase"
                  :edit-delegate="DBFileDelegate"
                >
                  <template slot="header">
                    <b-button-group>
                      <b-button
                        @click="$bvModal.show(phase[0]+'phase'+cyberEvent[0]+'event'+storyElement[0])"
                        variant="info"
                      >
                        Edit
                      </b-button>
                      <b-button
                        v-if="cyberEvent[3] != phase[0]"
                        @click="RemovePhase(cyberEvent, phase)"
                        variant="warning"
                      >
                        Remove
                      </b-button>
                      <CyberModal :id-value="phase[0]+'phase'+cyberEvent[0]+'event'+storyElement[0]">
                        <template
                          slot="cyber-item"
                          scope="props"
                        >
                          <CyberCardEdit
                            :phase="phase"
                            :can-save="props.canSave"
                            :edit-delegate="DBFileDelegate"
                          />
                        </template>
                      </CyberModal>
                    </b-button-group>
                  </template>
                </CyberCard>
              </draggable>
            </CyberTab>
            <template v-slot:tabs-end>
              <b-nav-item
                role="presentation"
                @click.prevent="AddEvent(storyElement)"
                href="#"
              >
                <b>+</b>
              </b-nav-item>
            </template>
          </b-tabs>
        </CyberTab>
        <template v-slot:tabs-end>
          <b-nav-item
            role="presentation"
            @click.prevent="AddStory"
            href="#"
          >
            <b>+</b>
          </b-nav-item>
        </template>
      </b-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import CyberCardGroup from '@/components/CyberCardGroup.vue'
import CyberTab from '@/components/CyberTab.vue'
import CyberCard from '@/components/CyberCard.vue'
import CyberModal from '@/components/CyberModal.vue'
import CyberCardEdit from '@/components/CyberCardEdit.vue'
import DatabaseInit from '@/components/DatabaseInit.vue'
import DBFile from '../types/DBFile'

@Component({
  components: {
    draggable,
    CyberCardGroup,
    CyberTab,
    CyberCard,
    CyberModal,
    CyberCardEdit,
    DatabaseInit
  }
})
export default class HelloWorld extends Vue {
    @Prop() private msg!: string;
    private DBFileDelegate!: DBFile;
    private phaseList: [number, string, string, number, number, [], []][] = [];
    private componentKey = 0;
    public LoadData (event: DBFile) {
      this.DBFileDelegate = event
      this.$forceUpdate()
    }

    public test () {
      this.$http
        .get('/foo')
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log('begin error')
          console.log(error)
          console.log('end error')
        })
    }

    public forceRerender () {
      this.componentKey++
    }

    get getValues () {
      return this.$store.state.values
    }

    public AddStory () {
      this.DBFileDelegate.DBFileGetData(
        'INSERT INTO EventPhase (StartingCondition, EndingCondition, RepeatNumber, NextPhaseCode)VALUES (\'str\', \'Hack\', 1, -1)'
      )
      this.DBFileDelegate.DBFileGetData(
        'INSERT INTO Event(StartingCondition, NextEventCode, StartEventPhaseCode) VALUES (\'Refuel\',-1, (SELECT MAX(Code)  FROM EventPhase))'
      )
      this.DBFileDelegate.DBFileGetData(
        `INSERT INTO Story VALUES (${this.getValues.story.length}, (SELECT MAX(Code)  FROM Event))`
      )
    }

    public RemoveStory (storyElement) {
      this.DBFileDelegate.DBFileGetData(`DELETE FROM Story WHERE Code = ${storyElement[0]}`)
    }

    public AddEvent (storyElement) {
      this.DBFileDelegate.DBFileGetData(
        'INSERT INTO EventPhase (StartingCondition, EndingCondition, RepeatNumber, NextPhaseCode)VALUES (\'str\', \'Hack\', 1, -1)'
      )
      this.DBFileDelegate.DBFileGetData(
        'INSERT INTO Event(StartingCondition, NextEventCode, StartEventPhaseCode) VALUES (\'Refuel\',-1, (SELECT MAX(Code)  FROM EventPhase))'
      )
      this.DBFileDelegate.DBFileGetData(`UPDATE Event SET NextEventCode =
      (SELECT Code FROM Event WHERE Code = (SELECT MAX(Code)  FROM Event))
      WHERE Code = ${storyElement.event[storyElement.event.length - 1][0]}`)
    }

    public RemoveEvent (storyElement, cyberEvent) {
      this.DBFileDelegate.DBFileGetData(
        `UPDATE Event SET NextEventCode = ${cyberEvent[2]} WHERE NextEventCode = ${cyberEvent[0]}`
      )
      // this.DBFileDelegate.DBFileGetData(`DELETE FROM Event WHERE Code = ${storyElement.event[storyElement.event.indexOf(cyberEvent)][0]}`)
    }

    public AddPhase (cyberEvent) {
      const temp = cyberEvent.phase.slice(0)
      this.DBFileDelegate
        .DBFileGetData(`INSERT INTO EventPhase (StartingCondition, EndingCondition, RepeatNumber, NextPhaseCode)
      VALUES ('str', 'Hack', 1, -1)`)
      this.DBFileDelegate.DBFileGetData(`UPDATE EventPhase SET NextPhaseCode =
      (SELECT Code FROM EventPhase WHERE Code = (SELECT MAX(Code)  FROM EventPhase))
      WHERE Code = ${temp[temp.length - 1][0]}`)
    }

    public RemovePhase (cyberEvent, phaseEvent) {
      this.DBFileDelegate.DBFileGetData(
        `UPDATE EventPhase SET NextPhaseCode = ${phaseEvent[4]} WHERE NextPhaseCode = ${phaseEvent[0]}`
      )
    }

    public OnStart (phaseList) {
      console.log(phaseList)
      this.phaseList = phaseList.slice(0)
    }

    public OnChange (event) {
      console.log(event)
      console.log(this.phaseList)
      let tempSql = ''
      if (event.moved.newIndex > event.moved.oldIndex) {
        if (this.phaseList[0][0] === event.moved.element[0]) {
          tempSql = `UPDATE Event SET StartEventPhaseCode = ${event.moved.element[4]}
          WHERE Code = (SELECT Code FROM Event WHERE StartEventPhaseCode = ${event.moved.element[0]})`
        } else {
          tempSql = `UPDATE EventPhase SET NextPhaseCode = ${event.moved.element[4]}
          WHERE Code = (SELECT Code FROM EventPhase WHERE NextPhaseCode = ${event.moved.element[0]})`
        }
        this.DBFileDelegate.DBFileGetData(`
BEGIN TRANSACTION;
UPDATE EventPhase SET NextPhaseCode = ${this.phaseList[event.moved.newIndex][4]} WHERE Code = ${event.moved.element[0]};
${tempSql};
UPDATE EventPhase SET NextPhaseCode = ${event.moved.element[0]} WHERE Code = ${this.phaseList[event.moved.newIndex][0]};
COMMIT;`)
      } else {
        if (event.moved.newIndex === 0) {
          tempSql = `UPDATE Event SET StartEventPhaseCode = ${event.moved.element[0]}
          WHERE Code = (SELECT Code FROM Event WHERE StartEventPhaseCode = ${this.phaseList[0][0]})`
        } else {
          tempSql = `UPDATE EventPhase SET NextPhaseCode = ${event.moved.element[0]}
          WHERE Code = (SELECT Code FROM EventPhase WHERE NextPhaseCode = ${this.phaseList[event.moved.newIndex][0]})`
        }
        this.DBFileDelegate.DBFileGetData(`
BEGIN TRANSACTION;
UPDATE EventPhase SET NextPhaseCode = ${event.moved.element[4]} WHERE Code = (SELECT Code FROM EventPhase WHERE NextPhaseCode = ${event.moved.element[0]});
${tempSql};
UPDATE EventPhase SET NextPhaseCode = ${this.phaseList[event.moved.newIndex][0]} WHERE Code = ${event.moved.element[0]};
COMMIT;`)
        console.log(`
BEGIN TRANSACTION;
UPDATE EventPhase SET NextPhaseCode = ${event.moved.element[4]} WHERE Code = (SELECT Code FROM EventPhase WHERE NextPhaseCode = ${event.moved.element[0]});
UPDATE EventPhase SET NextPhaseCode = ${this.phaseList[event.moved.newIndex][0]} WHERE Code = ${event.moved.element[0]};
${tempSql};
COMMIT;`)
      }
    }

    public OnEnd () {
      console.log('end')
      this.forceRerender()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.masonry {
  display: flex;
  flex-flow: row wrap;
  margin-left: -8px; /* Adjustment for the gutter */
  width: 100%;
}

.masonry-brick {
  flex: auto;
  height: 325px;
  min-width: 150px;
  margin: 0 8px 8px 0; /* Some gutter */
}

.masonry-brick:nth-child(4n+1) {
  width: 250px;
}
.masonry-brick:nth-child(4n+1):nth-child(4n+2) {
  width: 325px;
}
.masonry-brick:nth-child(4n+1):nth-child(4n+3) {
  width: 180px;
}
.masonry-brick:nth-child(4n+1):nth-child(4n+4) {
  width: 380px;
}

</style>
