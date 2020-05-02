<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RightMenuGuest from '~/components/layout/right-menu-guest'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'
import LeftMenu from '~/components/layout/left-menu'
import RightSidebar from '~/components/layout/right-sidebar'

export default {
  name: 'main-layout',
  components: { RightMenuGuest, RightMenuAuthenticated, LeftMenu, RightSidebar },
  data () {
    return {
      left: !this.$q.platform.is.mobile,
      background: 'background: url("statics/bg/main.png")'
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapGetters('layout', ['rightSidebarType', 'breadcrumbs']),
    ...mapGetters('notifications', ['successCount', 'errorCount'])
  },
  methods: {
    ...mapMutations('notifications', ['initNotifications', 'unmarkRead', 'unmarkNew']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('periods', ['fetchPeriods']),
    toggleNotifications () {
      if (this.rightSidebarType === 'notifications') {
        this.unmarkRead()
        this.setShowRightSidebar(false)
        this.setRightSidebarType(null)
      } else {
        this.setShowRightSidebar(true)
        this.setRightSidebarType('notifications')
      }
    }
  },
  async mounted () {
    this.initNotifications()
    await this.fetchPeriods()
  }
}
</script>

<template lang="pug">
q-layout(
  view="lHr lpR fFf"
  ref="layout"
)
  .bg(:style="background")
  router-link.q-ml-sm.float-left.logo(to="/" style="display:block;margin-top:8px")
  q-header.bg-none(
    reveal
  )
    q-toolbar
      q-toolbar-title.q-mt-xs.flex.items-center
        q-btn.float-left(
          icon="fas fa-bars"
          dense
          round
          unelevated
          color="white"
          text-color="black"
          @click="left = !left"
          size="18px"
          style="margin-top:8px"
        )
      right-menu-guest
      right-menu-authenticated
  q-drawer(
    v-model="left"
    bordered
  )
    left-menu(
      @close="left = false"
    )
  right-sidebar
  q-page-container
    router-view
</template>

<style lang="stylus" scoped>
.breadcrumb
  display inline-flex
  color #434343
  margin-left 10px
  font-size 30px
  line-height 30px
  .location
    font-weight 800
  > *
    display inline-block
    text-decoration none
  .link
    &:hover
     text-decoration underline
.bg-none
  background none
.bg
  background-size cover !important
  height 100vh
  position fixed
  width 100vw
.notification-badge
  font-size 10px
  padding 2px 3px
  right -5px
.badge-left
  left -5px
  right auto
.logo
  position fixed
  bottom 5px
  right 25px
.mobile-logo
  width 100px !important
.map-marked
  width 44px
  height 44px
  margin-top 8px
  margin-left 5px
  border-radius 50%
</style>
