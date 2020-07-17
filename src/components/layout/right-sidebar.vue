<script>
import { mapGetters, mapMutations } from 'vuex'
import RightMenuNotifications from '~/components/layout/right-menu-notifications'
import ProposalForm from '~/pages/proposals/components/proposal-form'
import ProfileForm from '~/pages/profiles/edit/profile-edit'

export default {
  name: 'right-sidebar',
  components: {
    RightMenuNotifications,
    ProposalForm,
    ProfileForm
  },
  data () {
    return {
      display: false
    }
  },
  computed: {
    ...mapGetters('layout', ['isShowRightSidebar', 'rightSidebarType', 'contentData'])
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar'])
  },
  watch: {
    isShowRightSidebar: {
      immediate: true,
      handler (val) {
        this.display = val
      }
    }
  }
}
</script>

<template lang="pug">
q-drawer(
  v-model="display"
  side="right"
  overlay
  bordered
  :width="$q.platform.is.desktop ? 500 : '100%'"
  behavior="mobile"
  @hide="setShowRightSidebar(false)"
  no-swipe-close
  no-swipe-open
)
  right-menu-notifications(v-show="rightSidebarType === 'notifications'")
  proposal-form(
    v-if="rightSidebarType === 'proposalForm'"
    :draft="contentData"
  )
  profile-form(v-if="rightSidebarType === 'profileForm'")
</template>

<style lang="stylus" scoped>

</style>
