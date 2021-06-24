<template>
  <div class="container mx-auto h-screen flex flex-col">
    <timer-row class="my-1" />

    <div class="text-xl">Log</div>
    <div class="flex-1 overflow-y-auto">
      <log v-for="log in logList" :key="log.id" :detail="log" />
    </div>
  </div>
</template>

<script>
import TimerRow from '@/components/TimerRow'
import Log from '@/components/Log'

export default {
  components: {
    TimerRow, Log
  },
  computed: {
    logList () {
      return this.$store.getters['Log/getlist']
    }
  }
}
</script>

<style>
</style>
