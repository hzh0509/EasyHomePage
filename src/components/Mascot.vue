<template>
  <div
    ref="rootEl"
    class="jn-mascot"
    :class="[`phase-${phase}`, { 'is-hover': hovering, 'is-poke': poking, 'is-reduced': reduced }]"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click="onPoke"
  >
    <div class="jn-mascot-glow" aria-hidden="true"></div>

    <div class="jn-mascot-figure">
      <img class="jn-mascot-img" :src="memoji" alt="Zihan Huang" draggable="false" />
      <div v-if="phase === 'sleep'" class="jn-mascot-zzz" aria-hidden="true">
        <span class="jn-zzz z1">z</span>
        <span class="jn-zzz z2">z</span>
        <span class="jn-zzz z3">Z</span>
      </div>
    </div>

    <div class="jn-mascot-shadow" aria-hidden="true"></div>

    <transition name="jn-bubble">
      <p v-if="bubble" class="jn-mascot-bubble">{{ bubble }}</p>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import memoji from '/contents/memoji.png';

const props = defineProps({
  lines: { type: Array, default: () => [] },
});

// idle -> sleep -> wake -> idle，hover / click 触发互动
const phase = ref('idle');
const hovering = ref(false);
const poking = ref(false);
const bubble = ref('');
const reduced = ref(false);

const timers = [];
const later = (fn, ms) => {
  timers.push(setTimeout(fn, ms));
};
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers.length = 0;
};

const fallbackLines = ['……', 'Hi.'];
const lines = computed(() => (props.lines && props.lines.length ? props.lines : fallbackLines));
const pickLine = () => lines.value[Math.floor(Math.random() * lines.value.length)];

const say = (ms = 2400) => {
  bubble.value = pickLine();
  later(() => {
    bubble.value = '';
  }, ms);
};

const wake = () => {
  if (phase.value !== 'sleep') return;
  phase.value = 'wake';
  later(() => {
    if (phase.value !== 'wake') return;
    phase.value = 'idle';
    say(2000);
  }, 1000);
};

const onEnter = () => {
  hovering.value = true;
  if (phase.value === 'sleep') wake();
  else say();
};

const onLeave = () => {
  hovering.value = false;
};

const onPoke = () => {
  if (phase.value === 'sleep') {
    wake();
    return;
  }
  poking.value = true;
  say(1700);
  later(() => {
    poking.value = false;
  }, 720);
};

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced.value) return;

  // 每个浏览器会话首次进入时睡一下再惊醒，之后直接待机
  const seen = sessionStorage.getItem('jn-mascot-seen') === '1';
  if (!seen) {
    sessionStorage.setItem('jn-mascot-seen', '1');
    phase.value = 'sleep';
    later(wake, 1800);
  }
});

onBeforeUnmount(clearTimers);
</script>

<style scoped>
.jn-mascot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.jn-mascot-glow {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: min(78%, 460px);
  aspect-ratio: 1 / 1;
  transform: translate(-50%, 12%);
  background: radial-gradient(circle, rgba(94, 58, 238, 0.16) 0%, rgba(94, 58, 238, 0.05) 45%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.jn-mascot-figure {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  width: 100%;
  transform-origin: 50% 100%;
  will-change: transform;
}

.jn-mascot-img {
  display: block;
  height: 100%;
  width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: bottom center;
  transform-origin: 50% 100%;
  filter: drop-shadow(0 16px 22px rgba(15, 18, 33, 0.14));
  will-change: transform;
  transition: filter 0.35s ease;
  user-select: none;
}

/* 地面投影 */
.jn-mascot-shadow {
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: min(52%, 300px);
  height: 22px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(15, 18, 33, 0.22) 0%, rgba(15, 18, 33, 0.08) 45%, transparent 72%);
  border-radius: 50%;
  filter: blur(3px);
  pointer-events: none;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

/* ---------- 待机：呼吸 + 轻微摇摆 ---------- */
.phase-idle .jn-mascot-img {
  animation: jn-breathe 5.4s ease-in-out infinite;
}
.phase-idle .jn-mascot-figure {
  animation: jn-sway 7.6s ease-in-out infinite;
}
.phase-idle .jn-mascot-shadow {
  animation: jn-shadow-breathe 5.4s ease-in-out infinite;
}

/* ---------- 睡觉：低头、下沉、呼吸更慢 ---------- */
.phase-sleep .jn-mascot-img {
  animation: jn-sleep-breathe 6.8s ease-in-out infinite;
  filter: brightness(0.94) saturate(0.9) drop-shadow(0 10px 18px rgba(15, 18, 33, 0.14));
}
.phase-sleep .jn-mascot-figure {
  transform: translateY(10px) rotate(-2.4deg);
  transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}
.phase-sleep .jn-mascot-glow {
  opacity: 0.55;
}
.phase-sleep .jn-mascot-shadow {
  transform: translateX(-50%) scaleX(1.12);
  opacity: 0.85;
}

/* ---------- 惊醒：弹一下 ---------- */
.phase-wake .jn-mascot-img {
  animation: jn-wake-bounce 1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* ---------- 悬停：微微前倾、阴影收拢 ---------- */
.is-hover .jn-mascot-img {
  filter: drop-shadow(0 20px 26px rgba(94, 58, 238, 0.24));
}
.is-hover .jn-mascot-figure {
  transform: translateY(-4px) scale(1.012);
}
.is-hover .jn-mascot-shadow {
  transform: translateX(-50%) scaleX(0.94);
  opacity: 0.7;
}

/* ---------- 点击：压扁回弹 ---------- */
.is-poke .jn-mascot-img {
  animation: jn-poke-squash 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* ---------- 不说话 ---------- */
.jn-mascot-zzz {
  position: absolute;
  top: 6%;
  right: 6%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  pointer-events: none;
}
.jn-zzz {
  font-weight: 700;
  color: var(--neutral-500, #656b8e);
  opacity: 0;
  animation: jn-zzz-float 3.6s ease-in-out infinite;
}
.jn-zzz.z1 { font-size: 14px; margin-left: 0; animation-delay: 0s; }
.jn-zzz.z2 { font-size: 20px; margin-left: 10px; animation-delay: 0.7s; }
.jn-zzz.z3 { font-size: 26px; margin-left: 22px; animation-delay: 1.4s; }

/* ---------- 对话气泡 ---------- */
.jn-mascot-bubble {
  position: absolute;
  top: 14%;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0.55rem 0.9rem;
  max-width: 220px;
  background: #fff;
  color: var(--neutral-800, #1e2238);
  font-size: 0.86rem;
  line-height: 1.45;
  font-weight: 400;
  border-radius: 14px;
  box-shadow: 0 8px 22px rgba(15, 18, 33, 0.16);
  pointer-events: none;
  z-index: 2;
}
.jn-mascot-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 2px;
}

.jn-bubble-enter-active,
.jn-bubble-leave-active {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.jn-bubble-enter-from,
.jn-bubble-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px) scale(0.92);
}

@keyframes jn-breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-7px) scale(1.008); }
}
@keyframes jn-sleep-breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.014); }
}
@keyframes jn-sway {
  0%, 100% { transform: rotate(-0.6deg); }
  50% { transform: rotate(0.6deg); }
}
@keyframes jn-shadow-breathe {
  0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.9; }
  50% { transform: translateX(-50%) scaleX(0.9); opacity: 0.7; }
}
@keyframes jn-wake-bounce {
  0% { transform: translateY(10px) scale(0.97); }
  35% { transform: translateY(-18px) scale(1.03, 0.97); }
  60% { transform: translateY(0) scale(0.98, 1.03); }
  80% { transform: translateY(-6px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes jn-poke-squash {
  0% { transform: scale(1, 1); }
  30% { transform: scale(1.05, 0.93); }
  60% { transform: scale(0.97, 1.04); }
  100% { transform: scale(1, 1); }
}
@keyframes jn-zzz-float {
  0% { opacity: 0; transform: translateY(0) scale(0.9); }
  25% { opacity: 0.9; }
  70% { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(-22px) scale(1.1); }
}

/* 尊重系统减弱动效设置 */
.is-reduced .jn-mascot-img,
.is-reduced .jn-mascot-figure,
.is-reduced .jn-mascot-shadow,
.is-reduced .jn-zzz {
  animation: none !important;
}
.is-reduced .jn-mascot-figure {
  transform: none;
}
.is-reduced .jn-mascot-bubble {
  transition: none;
}
</style>
