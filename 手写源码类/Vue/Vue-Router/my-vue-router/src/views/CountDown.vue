<template>
  <div class="_base-count-down">
    还剩{{ days }}天{{ hours }}:{{ mins }}:{{ seconds }}
  </div>
</template>
<script>
export default {
  // 这样写少缩进一次
  data: () => ({
    days: "0",
    hours: "00",
    mins: "00",
    seconds: "00",
    timer: null,
  }),

  props: {
    time: {
      type: [Number, String],
      default: 0,
    },
    isMilliSecond: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    duration() {
      const { time: inTime, isMilliSecond } = this;
      const time = isMilliSecond ? Math.floor(+inTime / 1000) : +inTime;
      return time;
    },
  },

  mounted() {
    this.countDown();
  },

  methods: {
    countDown() {
      this.getTime(this.duration);
    },

    getTime(duration) {
      this.timer && clearTimeout(this.timer);

      if (duration < 0) {
        return;
      }

      const { dd, hh, mm, ss } = this.durationFormatter(duration);
      this.days = dd || 0;
      this.hours = hh || 0;
      this.mins = mm || 0;
      this.seconds = ss || 0;

      this.timer = setTimeout(() => {
        this.getTime(duration - 1);
      }, 1000);
    },

    durationFormatter(time) {
      if (!time) return { ss: 0 };
      let t = time;
      const ss = t % 60;
      t = (t - ss) / 60;
      if (t < 1) return { ss };
      const mm = t % 60;
      t = (t - mm) / 60;
      if (t < 1) return { mm, ss };
      const hh = t % 24;
      t = (t - hh) / 24;
      if (t < 1) return { hh, mm, ss };
      const dd = t;
      return { dd, hh, mm, ss };
    },
  },
};
</script>

<style lang='css' scoped>
</style>
