<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import removeMd from 'remove-markdown'
import { format } from '~/mixins/format'

export default {
  name: 'proposal-card',
  mixins: [format],
  props: {
    proposal: { type: Object, required: true },
    readonly: { type: Boolean, required: false, default: () => false }
  },
  data () {
    return {
      loading: true,
      details: false,
      profile: null,
      ballot: null,
      percentage: 0,
      quorum: 0,
      fail: null,
      pass: null,
      votesOpened: false,
      canCloseProposal: false,
      voting: false,
      userVote: null,
      role: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    type () {
      const data = this.proposal.names.find(o => o.key === 'type')
      let type = (data && data.value) || ''
      if (type === 'payout') {
        type = 'contribution'
      }
      return type
    },
    typeIcon () {
      if (this.type === 'contribution') {
        return 'fas fa-money-bill'
      } else if (this.type === 'assignment') {
        return 'far fa-id-badge'
      }
      return 'far fa-clipboard'
    },
    owner () {
      const data = this.proposal.names.find(o => o.key === 'owner')
      return (data && data.value) || ''
    },
    roleId () {
      const data = this.proposal.ints.find(o => o.key === 'role_id')
      return (data && data.value) || ''
    },
    title () {
      if (this.type === 'assignment') {
        if (this.role) {
          return this.role.strings.find(o => o.key === 'title').value
        }
      }
      const data = this.proposal.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      const obj = this.proposal.strings.find(o => o.key === 'description')
      if (obj) {
        return removeMd(obj.value).replace(/\n/g, ' ')
      }
      return ''
    },
    url () {
      const data = this.proposal.strings.find(o => o.key === 'url')
      return data && data.value
    }
  },
  async mounted () {
    await this.loadBallot(this.proposal.names.find(o => o.key === 'ballot_id').value)
    this.profile = await this.getPublicProfile(this.owner)
    if (this.type === 'assignment') {
      this.role = await this.fetchRole(this.roleId)
    }
    this.loading = false
  },
  watch: {
    async account (val) {
      if (val && this.ballot) {
        this.userVote = await this.getUserVote({
          user: val,
          ballot: this.ballot.ballot_name
        })
      }
    }
  },
  methods: {
    ...mapActions('proposals', ['closeProposal']),
    ...mapActions('trail', ['fetchBallot', 'castVote', 'getSupply', 'getUserVote']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('roles', ['fetchRole']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('proposals', ['removeProposal']),
    openUrl () {
      window.open(this.url)
    },
    async onCloseProposal () {
      this.voting = true
      await this.closeProposal(this.proposal.id)
      await this.removeProposal(this.proposal.id)
      this.voting = false
    },
    async loadBallot (id) {
      const result = await this.fetchBallot(id)
      if (result) {
        this.ballot = result
        const now = new Date(Date.now() + new Date().getTimezoneOffset() * 60 * 1000)
        this.votesOpened = now >= new Date(result.begin_time).getTime() && now <= new Date(result.end_time).getTime()
        this.canCloseProposal = now > new Date(result.end_time).getTime()
        this.pass = result.options.find(o => o.key === 'pass').value
        this.fail = result.options.find(o => o.key === 'fail').value
        if (parseFloat(this.pass) + parseFloat(this.fail) > 0) {
          this.percentage = parseFloat((parseFloat(this.pass) / (parseFloat(this.pass) + parseFloat(this.fail))) * 100).toFixed(2)
        } else {
          this.percentage = 0
        }
        const supply = parseFloat(await this.getSupply())
        if (supply > 0) {
          this.quorum = parseFloat(this.ballot.total_raw_weight) * 100 / supply
        }
        if (this.timeout) {
          clearInterval(this.timeout)
        }
        this.timeout = setInterval(this.updateCountdown, 1000)
        if (this.account) {
          this.userVote = await this.getUserVote({
            user: this.account,
            ballot: this.ballot.ballot_name
          })
        }
      }
    },
    async onCastVote (vote) {
      this.voting = true
      await this.castVote({
        id: this.ballot.ballot_name,
        vote
      })
      await this.loadBallot(this.ballot.ballot_name)
      this.voting = false
      this.userVote = vote
    },
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: `${this.type}ProposalView`,
        data: {
          proposal: this.proposal,
          ballot: this.ballot
        }
      })
    }
  }
}
</script>

<template lang="pug">
q-card.proposal
  .ribbon(v-if="!readonly")
    span.text-white.bg-hire(:class="`bg-${type}`") {{ type === 'assignment' ? 'APPLYING' : 'PROPOSING'}}
  .url(v-if="true || (url && url !== 'null')")
    q-btn(
      icon="fas fa-bookmark"
      @click="openUrl"
      flat
      :color="type"
      unelevated
      dense
    )
  .type
    span {{ type }}
    q-icon(:name="typeIcon" size="xs")
  q-img.owner-avatar(
    v-if="profile && profile.publicData.avatar"
    :src="profile.publicData.avatar"
    @click="$router.push({ path: `/@${owner}`})"
  )
  q-avatar.owner-avatar(
    v-else
    size="90px"
    color="teal"
    text-color="white"
    @click="$router.push({ path: `/@${owner}`})"
  )
    | {{ owner.slice(0, 2).toUpperCase() }}
  .username {{ (profile && profile.publicData && profile.publicData.name) || owner }}
  q-card-section
    .title {{ title }}
  q-card-section.description
    p {{ description | truncate(110) }}
  q-card-section.vote-section
    q-linear-progress.vote-bar.vote-bar-endorsed(
      rounded
      size="25px"
      :value="percentage / 100"
      :color="type"
      track-color="red"
    )
      .absolute-full.flex.flex-center
        .vote-text.text-white {{ percentage }}% endorsed
    q-linear-progress.vote-bar(
      rounded
      stripe
      size="25px"
      :value="quorum / 100"
      :color="quorum < 20 ? 'red' : 'teal-4'"
      track-color="grey-8"
    )
      .absolute-full.flex.flex-center
        .vote-text.text-white {{ parseFloat(quorum).toFixed(2) }}% voted
  q-card-actions.q-pb-lg.q-px-lg.flex.justify-around.proposal-actions(v-if="!readonly")
    q-btn(
      v-if="votesOpened"
      :icon="userVote === 'pass' ? 'fas fa-check-square' : null"
      :label="type === 'assignment' ? 'Enroll' : 'Endorse'"
      color="indigo-6"
      :loading="voting"
      @click="onCastVote('pass')"
      rounded
      dense
      unelevated
    )
    q-btn(
      v-if="votesOpened"
      :icon="userVote === 'fail' ? 'fas fa-check-square' : null"
      label="reject"
      color="red"
      :loading="voting"
      @click="onCastVote('fail')"
      rounded
      dense
      unelevated
    )
    .vote-info(v-if="!votesOpened && !userVote && owner !== account")
      q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
      | Voting period ended
    .vote-info(v-if="!votesOpened && userVote === 'pass' && owner !== account")
      q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
      | You endorsed this proposal
    .vote-info(v-if="!votesOpened && userVote === 'fail' && owner !== account")
      q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
      | You rejected this proposal
    q-btn.q-mt-sm(
      v-if="canCloseProposal && owner === account && ballot && ballot.status !== 'closed'"
      :label="percentage >= 80 && quorum >= 20 ? 'Activate' : 'Deactivate'"
      :color="percentage >= 80 && quorum >= 20 ? 'light-green-6' : 'red'"
      :loading="voting"
      @click="onCloseProposal"
      :style="{width: '200px'}"
      rounded
      dense
      unelevated
    )
</template>

<style lang="stylus" scoped>
.proposal
  width 300px
  border-radius 3px
  margin 10px
.owner-avatar
  cursor pointer
  border-radius 50% !important
  width 90px
  margin-top 60px
.username
  color #616161
  margin-top 5px
.description
  white-space pre-wrap
  height 100px
  overflow auto
  color #616161
.title
  cursor pointer
  text-align center
  font-size 20px
  font-weight 600
  color #605F60
  line-height 22px
  height 36px
.type
  color #4D4A4A
  text-transform uppercase
  position absolute
  top 5px
  right 10px
  font-weight 600
  font-size 16px
  i
    margin-left 10px
    margin-top -4px
.icon
  margin-top 20px
  width 100%
  max-width 100px
.url
  position absolute
  top -4px
  left 70px
  z-index 12
.proposal-actions
  button
    width 45%
    font-weight 700
    /deep/i
      font-size 16px
.vote-section
  padding 0 28px 10px
.vote-bar
  border-radius 14px
  /deep/.q-linear-progress__track
    opacity 1
.vote-bar-endorsed
  margin-bottom 5px
</style>
