<template>
  <div class="p-2 row">
    <div class="flex pb-1 items-center">
      <div class="flex-1">
        <div v-if="status === 'ZERO'">
          <input v-model="setting.title" type="text" class="text-black px-1 w-full rounded">
        </div>
        <div v-else>
          {{ setting.title }}
        </div>
      </div>
      <div class="pl-2">
        <div v-if="status !== 'ZERO'">
          {{ leftTimeText }}
        </div>
        <div v-else>
          <select v-model="setting.minutes" class="text-black rounded">
            <option v-for="list in minutesList" :key="list.value" :value="list.value">
              {{ list.title }}
            </option>
          </select>
          <span>:</span>
          <select v-model="setting.seconds" class="text-black rounded">
            <option v-for="list in secondsList" :key="list.value" :value="list.value">
              {{ list.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="pl-2">
        <button v-if="status === 'ZERO'" class="btn btn-regular pr-1" @click="start(false)">
          Start
        </button>
        <button v-if="status === 'WORKING'" class="btn btn-red-outline pr-1" @click="stop">
          Stop
        </button>
        <button v-if="status === 'STOPPED'" class="btn btn-regular pr-1" @click="start(true)">
          Restart
        </button>
        <button v-if="status !== 'WORKING'" class="btn btn-outline" @click="reset">
          Reset
        </button>
      </div>
    </div>
    <div class="progress">
      <div class="progress-bar" :style="{ width: progress + '%'}" />
    </div>
  </div>
</template>

<script>
import { toDigit } from '@/util/common'

export default {
  name: 'TimerRow',
  data: () => ({
    intervalId: null,
    minutesList: Array.from({ length: 100 }, (v, i) => { return { title: toDigit(i), value: i } }),
    secondsList: Array.from({ length: 60 }, (v, i) => { return { title: toDigit(i), value: i } }),
    setting: { minutes: 0, seconds: 0, title: '' }
  }),
  computed: {
    leftTimeText () {
      return this.$store.getters['Timer/leftTimeText']
    },
    progress () {
      return this.$store.getters['Timer/progress']
    },
    status () {
      return this.$store.getters['Timer/status']
    },
    leftTime () {
      return this.$store.getters['Timer/leftTime']
    }
  },
  methods: {
    start (restart = false) {
      if (!restart) {
        this.$store.dispatch('Timer/init', this.setting)
      }

      if (this.leftTime === 0) {
        return
      }

      this.$store.dispatch('Timer/start')

      this.intervalId = setInterval(() => {
        this.$store.dispatch('Timer/tick', this.leftTime - 1)

        if (this.leftTime <= 0) {
          this.stop()
          this.notify()
        }
      }, 1000)
    },

    stop () {
      this.$store.dispatch('Timer/stop')

      clearInterval(this.intervalId)
      console.log('timer is stopped')
    },

    reset () {
      this.setting = { minutes: 0, seconds: 0, title: '' }
      this.$store.dispatch('Timer/init', this.setting)
    },

    notify () {
      this.$store.dispatch('Log/add', {
        id: Date.now(),
        title: this.setting.title,
        total: this.setting.minutes * 60 + this.setting.seconds
      })
    }
  }
}
</script>

<style>
.row {
  font-family: 'Helvetica Neue', 'Arial';
  background-color: #53c9b3;
  color: #E7F7F5;
}

.progress {
  width: 100%;
  height: 14px;
  background-color: #b9ece6;
  border-radius: 4px;
}

.progress-bar {
  transition: width 0.2s linear;
  border-radius: 4px;
  height: 100%;
  background-color: #289ca0;
}

</style>
