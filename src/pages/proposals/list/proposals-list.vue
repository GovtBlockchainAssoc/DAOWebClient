<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProposalCard from '../components/proposal-card'
import DraftProposalCard from '../components/draft-proposal-card'

export default {
  name: 'page-proposals-list',
  components: { ProposalCard, DraftProposalCard },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapGetters('proposals', ['proposals', 'proposalsLoaded']),
    ...mapGetters('profiles', ['drafts'])
  },
  beforeMount () {
    this.clearData()
  },
  methods: {
    ...mapActions('proposals', ['fetchData']),
    ...mapMutations('proposals', ['clearData']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType', 'setBreadcrumbs']),
    async onLoad (index, done) {
      await this.fetchData({})
      done()
    },
    displayForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType(`${this.$route.params.type}Form`)
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .proposals-list(ref="proposalsListRef")
    q-infinite-scroll(
      :disable="proposalsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.proposalsListRef"
    )
      .row.text-center
        draft-proposal-card(
          v-for="draft in drafts.filter(d => d.type === 'proposal')"
          :key="draft.draft.id"
          :draft="draft.draft"
          :type="draft.type"
        )
        proposal-card(
          v-for="proposal in proposals"
          :key="proposal.proposal_id"
          :proposal="proposal"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-page-sticky(
    position="right"
    :offset="[18, 0]"
    :style="{'z-index': 100}"
  )
    .flex.column
      q-btn.q-mb-sm(
        v-if="isAuthenticated && ['contribution', 'role'].includes($route.params.type)"
        fab
        icon="fas fa-plus"
        color="red"
        size="lg"
        @click="displayForm"
      )
        q-tooltip Add a {{$route.params.type}}
      q-btn.q-mb-sm(
        fab
        icon="fas fa-sync-alt"
        color="secondary"
        size="lg"
        @click="clearData"
      )
        q-tooltip Refresh
      q-btn(
        fab
        icon="fas fa-history"
        color="accent"
        size="lg"
        to="/proposals/history"
      )
        q-tooltip History

</template>

<style lang="stylus" scoped>

</style>
