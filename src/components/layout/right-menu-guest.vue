<script>
import { mapGetters } from 'vuex'
import DialogRegister from '~/components/account/dialog-register'
import DialogLogin from '~/components/account/dialog-login'

export default {
  name: 'authentication',
  data () {
    return {
      showLogin: false,
      showRegister: false
    }
  },
  components: { DialogLogin, DialogRegister },
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
  dialog-login(:show.sync="showLogin")
  dialog-register(:show.sync="showRegister")
  q-btn.q-mr-sm(
    label="LOGIN"
    color="teal"
    text-color="white"
    dense
    unelevated
    @click="showLogin = true"
  )
  q-btn(
    label="REGISTER"
    color="role"
    text-color="white"
    dense
    unelevated
    @click="showRegister = true"
  )
    q-tooltip Register
</template>
