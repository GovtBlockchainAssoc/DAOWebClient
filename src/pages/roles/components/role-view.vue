<script>
import { mapGetters, mapMutations } from 'vuex'
import MarkdownDisplay from '~/components/form/markdown-display'
import { format } from '~/mixins/format'

export default {
  name: 'role-view',
  mixins: [format],
  components: { MarkdownDisplay },
  props: {
    role: { type: Object }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    owner () {
      const data = this.role.names.find(o => o.key === 'owner')
      return (data && data.value) || ''
    },
    title () {
      const data = this.role.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      const data = this.role.strings.find(o => o.key === 'description')
      return (data && data.value) || ''
    },
    url () {
      const data = this.role.strings.find(o => o.key === 'url')
      return (data && data.value !== 'null' && data.value) || null
    },
    minCommitted () {
      const data = this.role.ints.find(o => o.key === 'min_time_share_x100')
      return (data && data.value && `${(data.value).toFixed(2)}%`) || ''
    },
    rewardSalary () {
      const data = this.role.assets.find(o => o.key === 'weekly_reward_salary')
      return (data && data.value && parseFloat(data.value).toFixed(2)) || ''
    },
    voteSalary () {
      const data = this.role.assets.find(o => o.key === 'weekly_vote_salary')
      return (data && data.value && parseFloat(data.value).toFixed(2)) || ''
    },
    ftCapacity () {
      const data = this.role.ints.find(o => o.key === 'fulltime_capacity_x100')
      return (data && data.value && `${(data.value / 100).toFixed(1)}`) || ''
    },
    startPhase () {
      const obj = this.role.ints.find(o => o.key === 'start_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    endPhase () {
      const obj = this.role.ints.find(o => o.key === 'end_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    cycle () {
      if (!this.endPhase) return ''
      return (this.endPhase.period_id - this.startPhase.period_id) / 4
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    getIcon (phase) {
      switch (phase) {
        case 'First Quarter':
          return 'fas fa-adjust'
        case 'Full Moon':
          return 'far fa-circle'
        case 'Last Quarter':
          return 'fas fa-adjust reversed'
        case 'New Moon':
          return 'fas fa-circle'
        default:
          return 'fas fa-circle'
      }
    },
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    },
    open (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md {{ title }}
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
    q-btn.absolute-bottom-right.q-ma-xs(
      v-if="url"
      color="grey-8"
      flat
      dense
      icon="fas fa-link"
      @click="open(url)"
      size="sm"
    )
  fieldset.q-mt-sm(v-if="url")
    legend Supporting documentation
    a.link.q-my-md(:href="url" target="_blank") {{ url | truncate(60) }}
  fieldset.q-mt-sm
    legend Salary
    p Below is the minimum % commitment and minimum deferred salary required for this role, followed by Role capacity.
    .row.q-col-gutter-xs
      .col-3(:style="{width:'22%'}")
        q-input.bg-grey-4.text-black(
          v-model="minCommitted"
          outlined
          dense
          readonly
        )
        .hint Min committed
      .col-3(:style="{width:'16%'}")
        q-input.bg-grey-4.text-black(
          v-model="ftCapacity"
          outlined
          dense
          readonly
        )
        .hint ROLE CAP
      .col-3(:style="{width:'22%'}")
        q-input.bg-grey-4.text-black(
          v-model="voteSalary"
          outlined
          dense
          readonly
        )
        .hint Weekly vote pow
      .col-3(:style="{width:'40%'}")
        q-input.bg-grey-4.text-black(
          v-model="rewardSalary"
          outlined
          dense
          readonly
        )
        .hint Weekly reward
  fieldset.q-mt-sm
    legend Lunar cycles
    p This is the  lunar start and re-evaluation date for this role, followed by the number of lunar cycles.
    .row.q-col-gutter-xs
      .col-5(:style="{width:'39%'}")
        q-input.bg-grey-4.text-black(
          v-model="startPhase && new Date(startPhase.start_date).toLocaleDateString()"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(:name="getIcon(startPhase && startPhase.phase)")
      .col-5(:style="{width:'39%'}")
        q-input.bg-grey-4.text-black(
          v-model="endPhase && new Date(endPhase.start_date).toLocaleDateString()"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(:name="getIcon(endPhase && endPhase.phase)")
      .col-2(:style="{width:'22%'}")
        q-input.bg-grey-4.text-black(
          v-model="cycle"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(name="fas fa-hashtag")
  .row.flex.justify-between.q-mt-md
    q-btn(
      label="Close"
      rounded
      color="grey"
      unelevated
      @click="hide"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
.link
  color black
  display block
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
.vote-bar
  opacity 1
.vote-text
  font-weight 600
.proposal-actions
  button
    width 100px
</style>
