<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'layout-left-menu',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember'])
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('proposals', ['clearData']),
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
      style="height:90vh"
      :bordered="false"
      dense
    )
      q-item.q-mt-md.text-black(to="/proposals")
        q-item-section(avatar)
          q-icon(
            name="fa fa-home"
          )
        q-item-section
          strong MY DASHBOARD
      q-separator.q-my-sm
      q-item.q-mt-md.text-black(to="/proposals")
        q-item-section(avatar)
          q-icon(
            name="fa fa-check-circle"
          )
        q-item-section
          strong VOTE FOR PROPOSALS
      q-item.q-mt-md.text-black(to="/proposals/new")
        q-item-section(avatar)
          q-icon(
            name="fas fa-plus"
          )
        q-item-section
          strong CREATE PROPOSALS
      .absolute-bottom
        q-separator.q-my-sm
        q-item.text-black.cursor-pointer(
          @click="clearData"
        )
          q-item-section(avatar)
            q-icon(
              name="fas fa-sync"
            )
          q-item-section
            strong REFRESH
        q-item.text-black(to="/")
          q-item-section(avatar)
            q-icon(
              name="fas fa-folder"
            )
          q-item-section
            strong ARCHIVES
        q-item.text-black(to="/")
          q-item-section(avatar)
            q-icon(
              name="fas fa-info-circle"
            )
          q-item-section
            strong DAO INFO

</template>

<style lang="stylus" scoped>
.close-btn
  margin-top 10px
.btn-add
  margin-right 17px
.menu
  height 100%
  font-size 16px
  /deep/.q-item.q-router-link--active
    font-weight 700
    color teal
.menu > .q-item, .q-item--dense
  min-height 28px
</style>
