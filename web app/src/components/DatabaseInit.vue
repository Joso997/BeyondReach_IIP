<template>
  <div class="hello">
    <b-button @click="SaveDB">
      Spremi Bazu
    </b-button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import SQL from 'sql.js'
import DBFile from '../types/DBFile'
@Component
export default class DatabaseInit extends Vue {
    public msg = 'Welcome to Vue.js sql.js boilerplate';

    public created () {
      console.log('begin created HelloWorld')
      const delegate = new DBFile(this.DBFileIsLoaded.bind(this), null)
      this.$store.dispatch('getDBFile', { self: delegate })
      console.log('end created HelloWorld')
    }

    get lengthOfValues () {
      return this.$store.state.values.length
    }

    get getValues () {
      return this.$store.state.values
    }

    public DBFileIsLoaded (skipInit = false) {
      console.log('begin DBFileIsLoaded')
      console.log(this.$store.state.dbFile)
      console.log(this.$store.state.db)
      if (!skipInit) {
        this.$store.state.db = new SQL.Database(this.$store.state.dbFile)
        // this.CreateDatabase()
      }
      console.log(this.$store.state.db)
      let tempEvent: number
      let tempPhase: number
      console.log(this.$store.state.db.exec('select * from Story'))
      this.$store.state.values.story = this.$store.state.db.exec('select * from Story')[0].values
      this.$store.state.values.story.forEach((storyElement) => {
        this.$store.state.values.story[storyElement[0]].event = this.GetOrdered(storyElement, 'Event', 1, 2).slice(0)
        this.$store.state.values.story[storyElement[0]].event.forEach((eventElement) => {
          tempEvent = this.$store.state.values.story[storyElement[0]].event.indexOf(eventElement)
          this.$store.state.values.story[storyElement[0]].event[tempEvent].phase = this.GetOrdered(eventElement, 'EventPhase', 3, 4).slice(0)
          this.$store.state.values.story[storyElement[0]].event[tempEvent].phase.forEach((phaseElement) => {
            tempPhase = this.$store.state.values.story[storyElement[0]].event[tempEvent].phase.indexOf(phaseElement)
            if (this.$store.state.db.exec(`select * from Consequence where CodeEventPhase=${phaseElement[0]}`).length > 0) {
              this.$store.state.values.story[storyElement[0]].event[tempEvent].phase[tempPhase].consequence = this.$store.state.db.exec(
                `select * from Consequence where CodeEventPhase=${phaseElement[0]}`)[0].values
            } else {
              this.$store.state.values.story[storyElement[0]].event[tempEvent].phase[tempPhase].consequence = []
            }
            if (this.$store.state.db.exec(`select * from Dialogue where CodeEventPhase=${phaseElement[0]}`).length > 0) {
              this.$store.state.values.story[storyElement[0]].event[tempEvent].phase[tempPhase].dialogue = this.$store.state.db.exec(
                `select * from Dialogue where CodeEventPhase=${phaseElement[0]}`)[0].values
            } else {
              this.$store.state.values.story[storyElement[0]].event[tempEvent].phase[tempPhase].dialogue = []
            }
          })
        })
      })
      console.log(this.$store.state.values)
      const delegate = new DBFile(null, this.GetData.bind(this))
      this.$emit('load-data-event', delegate)
      // console.log(rlt)
      console.log('end DBFileIsLoaded')
    }

    public GetOrdered (element, table, columnParent, columnChild) {
      let end = 0
      const temp = this.$store.state.db.exec(`select * from ${table} where Code=${element[columnParent]}`)[0].values.slice(0)
      end = temp[0][columnChild]
      while (end !== -1) {
        temp.push(this.$store.state.db.exec(`select * from ${table} where Code=${end} `)[0].values[0])
        end = temp[temp.length - 1][columnChild]
      }
      return temp
    }

    public GetData (sql: string) {
      console.log('test2')
      this.$store.state.db.run(sql)
      this.DBFileIsLoaded(true)
    }

    public SaveDB () {
      const data = this.$store.state.db.export()
      const blob = new File([data], 'MainDatabase.db', { type: 'application/octet-stream' })
      window.open(URL.createObjectURL(blob))
    }

    CreateDatabase () {
      this.$store.state.db.exec(`BEGIN TRANSACTION;
      CREATE TABLE IF NOT EXISTS Story (Code INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, StartEventCode INTEGER REFERENCES Event (Code) NOT NULL);
      CREATE TABLE IF NOT EXISTS Event ( Code INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, StartingCondition STRING NOT NULL, NextEventCode INTEGER, StartEventPhaseCode INTEGER REFERENCES EventPhase (Code) NOT NULL );
      CREATE TABLE IF NOT EXISTS EventPhase ( Code INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, StartingCondition STRING NOT NULL, EndingCondition STRING NOT NULL, RepeatNumber INTEGER NOT NULL DEFAULT (1), NextPhaseCode INTEGER );
      CREATE TABLE IF NOT EXISTS Consequence ( Code INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT, CodeEventPhase INTEGER REFERENCES EventPhase (Code) NOT NULL, Probability INTEGER NOT NULL DEFAULT (0) CHECK (Probability >= 0 AND Probability <= 100), ObjectType INTEGER NOT NULL DEFAULT (0), DamageType INTEGER CHECK (DamageType = 0 OR DamageType = 1 OR DamageType = 2) NOT NULL DEFAULT (0), Severity INTEGER CHECK (Severity = 90 OR Severity = 75 OR Severity = 50 OR Severity = 25) NOT NULL DEFAULT (4), CONSTRAINT Unique_Code_CodeEventPhase UNIQUE ( Code, CodeEventPhase ) ON CONFLICT ABORT, CONSTRAINT Unique_ObjectType_CodeEventPhase UNIQUE ( CodeEventPhase, ObjectType ) ON CONFLICT ABORT );
      CREATE TABLE IF NOT EXISTS Dialogue ( Code INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, CodeEventPhase INTEGER REFERENCES EventPhase (Code) NOT NULL UNIQUE, Content STRING, CONSTRAINT Unique_Code_CodeEventPhase UNIQUE ( Code, CodeEventPhase ) );
      INSERT INTO Story ( StartEventCode, Code ) VALUES ( 0, 0 );
      INSERT INTO Event ( StartEventPhaseCode, NextEventCode, StartingCondition, Code ) VALUES ( 1, - 1, "Refuel", 0 );
      INSERT INTO EventPhase ( NextPhaseCode, RepeatNumber, EndingCondition, StartingCondition, Code ) VALUES ( - 1, 1, 'Hack', 'str', 0 ), ( 2, 1, 'Dialogue', 'ste', 1 ), ( 3, 1, 'Avoid', 'str', 2 ), ( 0, 1, 'Course', 'str', 3 );
      INSERT INTO Consequence ( Severity, DamageType, ObjectType, Probability, CodeEventPhase, Code ) VALUES ( 50, 0, 'Stasis', 100, 3, 1 ), ( 50, 0, 'Reactor', 100, 1, 2 ), ( 25, 0, 'Reactor', 50, 0, 3 );
      INSERT INTO Dialogue ( Content, CodeEventPhase, Code ) VALUES ( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 1, 0 ), ( 'test', 2, 1 );
      COMMIT;`)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  h1,
  h2 {
    font-weight: normal;
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
