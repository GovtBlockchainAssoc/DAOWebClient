<script>
import { mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import MarkdownDisplay from '~/components/form/markdown-display'

export default {
  name: 'assignment-view',
  mixins: [forms, validation],
  components: { MarkdownDisplay },
  props: {
    data: { type: Object }
  },
  data () {
    return {
      display: {
        votepow: 0,
        reward: 0
      },
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    ...mapGetters('payouts', ['seedsToUsd']),
    title () {
      if (!this.data.role) return ''
      const data = this.data.role.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      if (!this.data.assignment) return ''
      const data = this.data.assignment.strings.find(o => o.key === 'description')
      return (data && data.value) || ''
    },
    url () {
      if (!this.data.assignment) return ''
      const data = this.data.assignment.strings.find(o => o.key === 'url')
      return (data && data.value !== 'null' && data.value) || null
    },
    salaryCommitted () {
      const data = this.data.assignment.ints.find(o => o.key === 'time_share_x100')
      return (data && data.value && `${(data.value).toFixed(2)}%`) || ''
    },
    rewardSalary () {
      const data = this.data.assignment.assets.find(o => o.key === 'weekly_reward_salary')
      return (data && data.value && parseFloat(data.value).toFixed(2)) || 0
    },
    voteSalary () {
      const data = this.data.assignment.assets.find(o => o.key === 'weekly_vote_salary')
      return (data && data.value && parseFloat(data.value).toFixed(2)) || 0
    },
    startPhase () {
      const obj = this.data.assignment.ints.find(o => o.key === 'start_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    endPhase () {
      const obj = this.data.assignment.ints.find(o => o.key === 'end_period')
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
    computeTokens (committed) {
      const committedSan = isNaN(committed) ? 0 : parseFloat(committed || 0)
      this.display.votepow = (this.voteSalary * committedSan / 100).toFixed(2)
      this.display.reward = (this.rewardSalary * committedSan / 100).toFixed(2)
    },
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
  },
  watch: {
    data: {
      immediate: true,
      handler () {
        this.computeTokens(
          parseFloat(this.salaryCommitted)
        )
      }
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
  fieldset.q-mt-sm
    legend Salary
    p  % commitment and salary.
    .row.q-col-gutter-xs.q-mb-md
      .col-xs-12.col-md-4
        q-input.bg-grey-4.text-black(
          v-model="salaryCommitted"
          label="Committed"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
      .col-xs-12.col-md-4
        q-input.bg-liquid.text-black(
          v-model="display.votepow"
          outlined
          dense
          readonly
        )
        .hint vote pow
      .col-xs-12.col-md-4
        q-input.bg-liquid.text-black(
          v-model="display.reward"
          outlined
          dense
          readonly
        )
        .hint reward
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
.title
  font-size 20px
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
button
  width 30%
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
</style>
