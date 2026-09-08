<template>
    <header class="navbar navbar-expand-lg py-2 mb-3 jn-navbar-top">
        <nav id="navbar-top" class="container-xl">
            <div class="jn-logo">
                <a class="navbar-brand flex align-items-center align-content-center" href="#">
                    <span>
                        <img :src="logo" alt="logo" class="jn-logo-img">
                    </span>
                    <span class="fw-bold">{{ attributes.Name }}</span>
                    <span class="fw-lighter" :title="attributes.AgeTitle">.v{{ age }}</span>
                </a>
            </div>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" :aria-label="attributes.ToggleNavigation">
                <span class="navbar-toggler-icon bg-transparent"></span>
            </button>

            <div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                <div class="navbar-nav align-items-lg-center">
                    <a v-for="item in ['Introduce','Conversations', 'Abilities', 'Jobs', 'Products', 'Works', 'Pricing', 'Footer']"
                        :key="item" class="nav-link" :href="`#${item}`">{{ attributes[item] }}</a>
                    <div class="jn-language-switch ms-lg-3 mt-2 mt-lg-0" aria-label="Language switcher">
                        <a href="/cn/" class="jn-language-link" :class="{ active: currentLanguage === 'cn' }">中文</a>
                        <span class="jn-language-divider">/</span>
                        <a href="/en/" class="jn-language-link" :class="{ active: currentLanguage === 'en' }">EN</a>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { attributes } from '@content/nav.md';
import logo from '/contents/logo.png';

const age = ref(0);
const currentLanguage = window.location.pathname.startsWith('/cn') ? 'cn' : 'en';

const calAge = () => {
    const now = new Date();
    const birth = new Date('1997-05-09');
    const diff = now.getTime() - birth.getTime();
    const ageInMilliseconds = new Date(diff);
    const ageInYears = Math.abs(ageInMilliseconds.getUTCFullYear() - 1970);
    const ageInDecimal = ageInYears + (ageInMilliseconds.getMonth() / 12);
    age.value = ageInDecimal.toFixed(2);
};

onMounted(() => {
    calAge();
});
</script>

<style scoped>
.dark-mode-nav {
    background-color: #171a1d !important;
    border-color: #a8a8a863 !important;
}

.jn-navbar-top {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.7);
}

.jn-logo-img {
    width: 28pt;
    height: 28pt;
    border-radius: 50%;
    margin-right: 10px;
}

.jn-language-switch {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.22rem 0.6rem;
    border: 1px solid rgba(115, 17, 145, 0.22);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    width: fit-content;
}

.jn-language-link {
    color: var(--bs-secondary-color);
    text-decoration: none;
    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1.2;
}

.jn-language-link:hover,
.jn-language-link.active {
    color: var(--purple);
}

.jn-language-link.active {
    font-weight: 800;
}

.jn-language-divider {
    color: rgba(0, 0, 0, 0.28);
    font-size: 0.75rem;
}
</style>
