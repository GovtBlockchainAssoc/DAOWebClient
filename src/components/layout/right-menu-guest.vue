<script>
import { mapGetters } from 'vuex'

export default {
  name: 'authentication',
  data () {
    return {
      showLogin: false,
      showRegister: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  },
  methods: {
    openHelp () {
      window.open(process.env.DOCUMENTATION, '_blank')
    }
  }
}
</script>

<template lang="pug">
div(v-if="!isAuthenticated")
  q-btn.q-mr-sm(
    to="/login"
    label="LOGIN"
    color="teal"
    text-color="white"
    dense
    unelevated
  )
  q-btn(
    to="/register"
    label="REGISTER"
    color="proposal"
    text-color="white"
    dense
    unelevated
  )
    q-tooltip Register
</template>
