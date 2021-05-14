<template>
  <Nav />
  <MapList/>
  <!-- <Chat /> -->
</template>

<script>
import Nav from '@/components/Nav.vue'
import MapList from '@/components/MapList.vue'
// import Chat from '@/components/Chat.vue'

export default {
  name: 'App',
  components: { Nav, MapList }
}
</script>
