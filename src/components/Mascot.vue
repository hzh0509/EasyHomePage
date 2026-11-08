<template>
  <div
    class="jn-mascot"
    :class="[`is-${phase}`, { 'is-hover': hovering, 'is-poke': poking }]"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click="onPoke"
  >
    <img class="jn-mascot-img" :src="frameSrc" alt="Zihan Huang" draggable="false" />

    <div v-if="phase === 'sleep'" class="jn-mascot-zzz" aria-hidden="true">
      <span class="z1">z</span><span class="z2">z</span><span class="z3">Z</span>
    </div>

    <transition name="jn-bubble">
      <p v-if="bubble" class="jn-mascot-bubble">{{ bubble }}</p>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// 所有帧由同一段绿幕视频/静帧抠像而来，共享同一个 420x936 画布，
// 因此无论切到哪一帧，人物位置都不会跳。
const modules = import.meta.glob('../assets/mascot/*.webp', { eager: true, query: '?url', import: 'default' });
const url = (name) => modules[`../assets/mascot/${name}.webp`];

const sleepSrc = url('sleep');
const idleSrc = url('idle');
const wakeFrames = Object.keys(modules)
  .filter((k) => k.includes('/wake-'))
  .sort()
  .map((k) => modules[k]);

const props = defineProps({
  lines: { type: Array, default: () => [] },
});

const WAKE_FPS = 12;
const SLEEP_MS = 3000;

const phase = ref('sleep');
const frameIdx = ref(0);
const hovering = ref(false);
const poking = ref(false);
const bubble = ref('');

const frameSrc = computed(() => {
  if (phase.value === 'wake') return wakeFrames[frameIdx.value] || idleSrc;
  return phase.value === 'sleep' ? sleepSrc : idleSrc;
});

const fallbackLines = ['……', 'Hi.'];
const lines = computed(() => (props.lines && props.lines.length ? props.lines : fallbackLines));

let timers = [];
let wakeTimer = null;
const later = (fn, ms) => {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
};
const clearAll = () => {
  timers.forEach(clearTimeout);
  timers = [];
  if (wakeTimer) {
    clearInterval(wakeTimer);
    wakeTimer = null;
  }
};

const say = (ms = 2400) => {
  bubble.value = lines.value[Math.floor(Math.random() * lines.value.length)];
  later(() => {
    bubble.value = '';
  }, ms);
};

const playWake = () => {
  phase.value = 'wake';
  frameIdx.value = 0;
  wakeTimer = setInterval(() => {
    if (frameIdx.value >= wakeFrames.length - 1) {
      clearInterval(wakeTimer);
      wakeTimer = null;
      phase.value = 'idle';
      return;
    }
    frameIdx.value += 1;
  }, 1000 / WAKE_FPS);
};

const onEnter = () => {
  hovering.value = true;
  if (phase.value !== 'sleep') say();
};

const onLeave = () => {
  hovering.value = false;
};

const onPoke = () => {
  poking.value = true;
  say(1700);
  later(() => {
    poking.value = false;
  }, 640);
};

onMounted(() => {
  // 首屏画完之后再预取惊醒序列，避免 3 秒切帧时卡一下
  const warm = () => {
    [...wakeFrames, idleSrc].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(warm, { timeout: 2000 });
  else later(warm, 800);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    phase.value = 'idle';
    return;
  }
  later(playWake, SLEEP_MS);
});

onBeforeUnmount(clearAll);
</script>

<style scoped>
.jn-mascot {
  position: absolute;
  right: -6px;
  bottom: 0;
  height: 88%;
  z-index: 3;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  /* 补偿：素材里臀与踩着的脚不在同一水平线，整体微倾让鞋底落到区块边界上 */
  --tilt: -6deg;
  --drop: 31%;
  --pivot-x: 55%;
  --pivot-y: 69%;
}

.jn-mascot-img {
  display: block;
  height: 100%;
  width: auto;
  transform: translateY(var(--drop)) rotate(var(--tilt));
  transform-origin: var(--pivot-x) var(--pivot-y);
  transition: filter 0.4s ease;
  user-select: none;
  filter: drop-shadow(0 18px 26px rgba(15, 18, 33, 0.12));
}

/* 睡着的呼吸：整张图极缓地上下浮动，不做缩放，避免边缘抖动 */
.is-sleep .jn-mascot-img {
  animation: jn-doze 6.4s ease-in-out infinite;
}
.is-idle .jn-mascot-img {
  animation: jn-breathe 5.6s ease-in-out infinite;
}
.is-hover .jn-mascot-img {
  filter: drop-shadow(0 22px 30px rgba(94, 58, 238, 0.22));
}
.is-poke .jn-mascot-img {
  animation: jn-poke 0.64s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.jn-mascot-zzz {
  position: absolute;
  top: 4%;
  right: 26%;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}
.jn-mascot-zzz span {
  font-weight: 700;
  color: var(--neutral-500, #656b8e);
  opacity: 0;
  animation: jn-zzz 3.4s ease-in-out infinite;
}
.jn-mascot-zzz .z1 { font-size: 13px; animation-delay: 0s; }
.jn-mascot-zzz .z2 { font-size: 18px; margin-left: 9px; animation-delay: 0.7s; }
.jn-mascot-zzz .z3 { font-size: 24px; margin-left: 20px; animation-delay: 1.4s; }

.jn-mascot-bubble {
  position: absolute;
  top: 8%;
  right: 62%;
  margin: 0;
  padding: 0.55rem 0.9rem;
  max-width: 210px;
  width: max-content;
  background: #fff;
  color: var(--neutral-800, #1e2238);
  font-size: 0.86rem;
  line-height: 1.45;
  border-radius: 14px;
  box-shadow: 0 8px 22px rgba(15, 18, 33, 0.16);
  pointer-events: none;
}
.jn-mascot-bubble::after {
  content: '';
  position: absolute;
  right: -5px;
  top: 18px;
  width: 12px;
  height: 12px;
  background: #fff;
  transform: rotate(45deg);
  border-radius: 2px;
}

.jn-bubble-enter-active,
.jn-bubble-leave-active {
  transition: opacity 0.26s ease, transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.jn-bubble-enter-from,
.jn-bubble-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.92);
}

@keyframes jn-doze {
  0%, 100% { transform: translateY(var(--drop)) rotate(var(--tilt)); }
  50% { transform: translateY(calc(var(--drop) - 9px)) rotate(var(--tilt)); }
}
@keyframes jn-breathe {
  0%, 100% { transform: translateY(var(--drop)) rotate(var(--tilt)); }
  50% { transform: translateY(calc(var(--drop) - 6px)) rotate(var(--tilt)); }
}
@keyframes jn-poke {
  0% { transform: translateY(var(--drop)) rotate(var(--tilt)) scale(1, 1); }
  30% { transform: translateY(var(--drop)) rotate(var(--tilt)) scale(1.04, 0.95); }
  60% { transform: translateY(var(--drop)) rotate(var(--tilt)) scale(0.98, 1.03); }
  100% { transform: translateY(var(--drop)) rotate(var(--tilt)) scale(1, 1); }
}
@keyframes jn-zzz {
  0% { opacity: 0; transform: translateY(0) scale(0.9); }
  25% { opacity: 0.9; }
  70% { opacity: 0.45; }
  100% { opacity: 0; transform: translateY(-20px) scale(1.1); }
}

@media (prefers-reduced-motion: reduce) {
  .jn-mascot-img { animation: none !important; }
  .jn-mascot-zzz span { animation: none; opacity: 0; }
}
</style>
