<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'layout-left-menu',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember'])
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    displayForm (type) {
      this.setShowRightSidebar(true)
      this.setRightSidebarType(`${type}Form`)
    }
  }
}
</script>

<template lang="pug">
  q-scroll-area.fit
    img.q-ml-sm(
      src="~assets/logos/logo.png"
      style="width:150px;"
    )
    q-list.menu(
      :bordered="false"
      dense
    )
      q-item.q-mt-md.text-black(to="/")
        q-item-section
          strong MY DASHBOARD
      q-separator.q-my-sm
      q-item.q-mt-md.text-black
        q-item-section
          strong VOTE ON PROPOSALS
      q-item(
        to="/applicants"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section ENROLL MEMBERS
      q-item(
        to="/proposals/role"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section ROLES
      q-item(
        to="/proposals/assignment"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section ASSIGNMENTS
      q-item(
        to="/proposals/contribution"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section ONE TIME PAYOUTS
      q-separator.q-my-sm
      q-item.q-mt-md.text-black
        q-item-section
          strong CREATE NEW PROPOSALS
      q-item(
        to="/applicants"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section NEW MEMBERS
      q-item(
        v-if="isAuthenticated && isMember"
        clickable
        v-ripple
        @click="displayForm('role')"
      )
        q-item-section(avatar)
        q-item-section PROPOSE ROLE
      q-item(
        to="/roles"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section APPLY FOR ROLE
      q-item(
        v-if="isAuthenticated && isMember"
        clickable
        v-ripple
        @click="displayForm('contribution')"
      )
        q-item-section(avatar)
        q-item-section PROPOSE PAYOUT
      q-separator.q-my-sm
      q-item.q-mt-md.text-black
        q-item-section
          strong AGREEMENTS
      q-item(
        to="/members"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section PARTICIPANTS
      q-item(
        to="/roles"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section ROLES
      q-item(
        to="/assignments"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section ASSIGNMENTS

</template>

<style lang="stylus" scoped>
.close-btn
  margin-top 10px
.btn-add
  margin-right 17px
.menu
  font-size 16px
  /deep/.q-item.q-router-link--active
    font-weight 700
    color teal
.menu > .q-item, .q-item--dense
  min-height 28px
</style>
