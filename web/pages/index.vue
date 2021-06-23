<template>
  <div class="container mx-auto h-screen">
    <timer-row class="mb-1" />
    <timer-row class="mb-1" />
    <timer-row class="mb-1" />
  </div>
</template>

<script>
import TimerRow from '@/components/TimerRow'

export default {
  components: {
    TimerRow
  }
}
</script>

<style>
</style>
