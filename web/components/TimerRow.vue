<template>
  <div class="p-2 row">
    <div class="flex pb-1 items-center">
      <div class="flex-1">
        <div v-if="status === 'ZERO'">
          <input v-model="timer.title" type="text" class="text-black px-1 w-full rounded">
        </div>
        <div v-else>
          {{ timer.title }}
        </div>
      </div>
      <div class="pl-2">
        <div v-if="status !== 'ZERO'">
          {{ leftTimeText }}
        </div>
        <div v-else>
          <select v-model="timer.minutes" class="text-black rounded">
            <option v-for="list in minutesList" :key="list.value" :value="list.value">
              {{ list.title }}
            </option>
          </select>
          <span>:</span>
          <select v-model="timer.seconds" class="text-black rounded">
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

const toDigit = (val) => {
  if (val === null || val === undefined) {
    return ''
  }
  return val.toString().padStart(2, '0')
}

export default {
  name: 'TimerRow',
  data: () => ({
    isWorking: false,
    leftTime: 0, // sec,
    intervalId: null,
    minutesList: Array.from({ length: 100 }, (v, i) => { return { title: toDigit(i), value: i } }),
    secondsList: Array.from({ length: 60 }, (v, i) => { return { title: toDigit(i), value: i } }),
    timer: { minutes: 0, seconds: 0, title: '' }
  }),
  computed: {
    leftTimeText: {
      get () {
        const min = Math.floor(this.leftTime / 60)
        const sec = this.leftTime % 60
        return `${toDigit(min)}:${toDigit(sec)}`
      }
    },
    progress: {
      get () {
        const total = this.timer.minutes * 60 + this.timer.seconds
        if (!total) {
          return 0
        } else {
          return Math.floor((this.leftTime / total) * 100)
        }
      }
    },
    status: {
      get () {
        if (this.isWorking && this.leftTime > 0) {
          return 'WORKING'
        } else if (!this.isWorking && this.leftTime > 0) {
          return 'STOPPED'
        } else {
          return 'ZERO'
        }
      }
    }
  },
  methods: {
    start (restart = false) {
      if (!restart) {
        this.leftTime = this.timer.minutes * 60 + this.timer.seconds
      }
      if (this.leftTime === 0) {
        console.log('timer is not started')
        return
      }
      this.isWorking = true
      this.intervalId = setInterval(() => {
        this.leftTime -= 1 // sec
        if (this.leftTime <= 0) {
          this.stop()
        }
      }, 1000)
    },
    stop () {
      this.isWorking = false
      clearInterval(this.intervalId)
      console.log('timer is stopped')
    },
    reset () {
      this.stop()
      this.leftTime = 0
      this.timer.minutes = 0
      this.timer.seconds = 0
      this.timer.title = ''
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
