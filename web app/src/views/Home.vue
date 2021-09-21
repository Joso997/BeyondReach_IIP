<template>
  <div class="home">
    <img
      height="240"
      width="240"
      alt="CyberTale logo"
      src="../assets/8XUffPYI_400x400.jpeg"
    >
    <HelloWorld msg="Cyber Database Editor" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
