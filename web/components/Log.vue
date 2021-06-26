<template>
  <div class="flex flex-row">
    <div class="w-20">
      {{ detail.id | timeString }}
    </div>
    <div class="flex-1">
      {{ detail.title | dummyTitle }}
    </div>
    <div class="w-12 text-justify">
      {{ detail.total | timerString }}
    </div>
  </div>
</template>

<script>
import { toDigit } from '@/util/common'

export default {
  name: 'Log',
  filters: {
    timeString (value) {
      if (!value) {
        return ''
      }
      const date = new Date(value)
      return `${toDigit(date.getHours())}:${toDigit(date.getMinutes())}:${toDigit(date.getSeconds())}`
    },
    dummyTitle (value) {
      if (!value || value === '') {
        return ''
      } else {
        return value
      }
    },
    timerString (value) {
      if (!value) {
        return ''
      }
      const min = Math.floor(value / 60)
      const sec = value % 60
      return `${toDigit(min)}:${toDigit(sec)}`
    }
  },
  props: {
    detail: {
      type: Object,
      required: true,
      default () {
        return {
          id: Date.now(),
          title: 'dummy',
          total: 0
        }
      }
    }
  }
}
</script>
