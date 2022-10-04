<template>
  <div class="language-selector">
  <select class=" nav-item nav-link no-border bs-white" v-model="$i18n.locale">
      <option class="dropdown-item" v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
  </select>
  </div>
</template>

<script>
export default {
  name: 'LocaleChanger',
  data () {
    return { langs: ['en', 'fr'] }
  }
}
</script>

<style scoped>
  .no-border  {
    border: none;
    outline: none;
    background-color: rgba(var(--bs-light-rgb),var(--bs-bg-opacity))!important;
    margin-bottom: 1px;
  }
  .language-selector {
    display: flex;
    justify-content: center;
  }
</style>
