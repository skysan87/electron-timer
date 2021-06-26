<template>
  <div class="container mx-auto h-screen flex flex-col">
    <div class="ml-1 flex justify-center">
      <button class="text-sm text-gray-500" @click="closeApp">Quit</button>
    </div>

    <timer-row />

    <div class="ml-1 text-center">Log</div>
    <div class="flex-1 mx-1 overflow-y-auto">
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
  },
  methods: {
    closeApp () {
      if (confirm('終了しますか？')) {
        window.close()
      }
    }
  }
}
</script>

<style>
</style>
