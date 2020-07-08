<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'page-login',
  mixins: [validation],
  data () {
    return {
      errorPrivateKey: null,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['loading'])
  },
  methods: {
    ...mapActions('accounts', ['loginWallet', 'loginInApp', 'autoLogin']),
    async onLoginWallet (idx) {
      await this.loginWallet({ idx, returnUrl: this.$route.query.returnUrl })
    },
    openUrl (url) {
      window.open(url)
    }
  }
}
</script>

<template lang="pug">
q-page.flex.flex-center.column
  transition(
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  )
    div
      .title
        strong Ignite GBA DAO
  .content.q-pa-md.row.q-col-gutter-md
    .col-xs-12.col-md-6
      .content-title Welcome!
      .content-text1 Please login with one of the wallets, your private key or continue as guest.
      .content-text2 For improved security, we recommend to download and install the Anchor wallet.
      .content-text3
        | New User?&nbsp;
        router-link(to="/register") Register here.
    .col-xs-12.col-md-6
      q-list
        q-item.wallet(
          v-for="(wallet, idx) in $ual.authenticators"
          :key="wallet.getStyle().text"
          v-ripple
          :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }"
        )
          q-item-section.cursor-pointer(
            avatar
            @click="onLoginWallet(idx)"
          )
            img(
              :src="wallet.getStyle().icon"
              width="30"
            )
          q-item-section.cursor-pointer(@click="onLoginWallet(idx)") {{ wallet.getStyle().text }}
          q-item-section(avatar)
            .flex
              q-spinner(
                v-if="loading === wallet.getStyle().text"
                :color="wallet.getStyle().textColor"
                size="2em"
              )
              q-btn(
                v-else
                :color="wallet.getStyle().textColor"
                icon="fas fa-download"
                @click="openUrl(wallet.getOnboardingLink())"
                target="_blank"
                dense
                flat
                size="12px"
              )
                q-tooltip Get app
        q-item.wallet.text-white(
          style="background:#0db68c"
          to="/proposals"
        )
          q-item-section.cursor-pointer continue as GUEST
</template>

<style lang="stylus" scoped>
.wallet
  border-radius 25px
  margin-bottom 10px
  text-transform uppercase
  font-weight 600
.title
  font-size 70px
  padding-bottom 20px
  @media (max-width: $breakpoint-xs-max)
    letter-spacing -3px
    font-size 3.5em
    line-height 1.2
.content
  text-align center
  width 450px
  border-radius 20px
  background rgba(255, 255, 255, 0.3)
  z-index 100
  @media (max-width: $breakpoint-xs-max)
    max-width 90%
  .content-title
    font-weight 600
    font-size 26px
  .content-text1
    font-size 1em
    line-height 1.2em
    margin-top 10px
    @media (max-width: $breakpoint-xs-max)
      max-width 90%
  .content-text2
    font-size 1em
    line-height 1.2em
    margin-top 30px
    @media (max-width: $breakpoint-xs-max)
      max-width 90%
  .content-text3
    font-size 12px
    margin-top 20px
    @media (max-width: $breakpoint-xs-max)
      max-width 90%
  .wallet-login
    cursor pointer
    text-decoration underline
  a
    color black
</style>
