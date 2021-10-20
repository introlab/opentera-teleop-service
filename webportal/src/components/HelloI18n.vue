<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloI18n'
})
</script>

<i18n>
{
  "en": {
    "hello": "Hello i18n in SFC!"
  },
  "fr": {
    "hello": "Salut i18n!"
  }
}
</i18n>
