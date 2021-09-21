<template>
  <div class="about">
    <h1>This is an about pagse</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CyberCardGroup from '@/components/CyberCardGroup.vue'
import CyberCardTest from '@/components/CyberCardTest.vue'
@Component({
  components: {
    CyberCardGroup,
    CyberCardTest
  }
})
export default class About extends Vue {
}
</script>

<style>
.board{
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  background-color: #313131;
  padding: 15px;
}
.board .card{
  padding: 15px 25px;
  background-color: #F3F3F3;
  cursor: pointer;
  margin-bottom: 15px;
}
</style>
