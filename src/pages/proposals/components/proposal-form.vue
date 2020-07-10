<script>
import { uid } from 'quasar'
import PeriodSelect from '~/components/form/period-select'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import { mapActions, mapGetters, mapMutations } from 'vuex'

const defaultDesc = '<b>Purpose</b><div>This guides the evolution of the role and is the part that changes the least.</div><div><br></div><div><b>Accountabilities</b></div><div>What is this role accountable to doing - what can others expect from this role? Provide a list of 5-10 bullet points.</div><div><br></div><div><b>Domain</b></div><div>What is under explicit control of that role? What do others need to ask this role permission to edit/change/interact with? Provide a list of tags.</div>'

export default {
  name: 'propsal-form',
  mixins: [forms, validation],
  components: { PeriodSelect },
  props: {
    draft: { type: Object }
  },
  data () {
    return {
      rules: {
        periodBefore: () => {
          if (!this.roleForm.startPeriod || !this.roleForm.endPeriod) {
            return true
          }
          return new Date(this.roleForm.startPeriod.startDate).getTime() < new Date(this.roleForm.endPeriod.startDate).getTime() || 'The start period must be before the end period'
        }
      },
      form: {
        id: uid(),
        title: null,
        description: defaultDesc,
        url: null,
        votingTokens: null,
        rewardTokens: null
      },
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('profiles', ['isConnected'])
  },
  methods: {
    ...mapActions('profiles', ['saveDraft', 'connectProfileApi']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onSaveDraft () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      if (!this.isConnected) {
        await this.connectProfileApi()
      }
      const success = await this.saveDraft({ type: 'proposal', draft: this.form })
      if (success) {
        await this.reset()
        this.hideForm()
        if (this.$route.path !== '/proposals') {
          await this.$router.push({ path: '/proposals' })
        }
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        id: uid(),
        title: null,
        description: defaultDesc,
        url: null
      }
      await this.resetValidation(this.form)
    },
    hideForm () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  },
  watch: {
    draft: {
      immediate: true,
      handler (val) {
        if (val) {
          this.form = {
            ...val
          }
        } else {
          this.reset()
        }
      }
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm NEW PROPOSAL
  q-input(
    ref="title"
    v-model="form.title"
    color="accent"
    label="Title"
    maxlength="100"
    :rules="[rules.required]"
    lazy-rules
    outlined
    dense
  )
  q-editor(
    v-model="form.description"
    :fullscreen.sync="isFullScreen"
    min-height="100px"
    :toolbar="isFullScreen ? fullScreenToolbar : defaultToolbar"
  )
  fieldset.q-mt-sm
    legend Supporting documentation
    q-input(
      ref="url"
      v-model="form.url"
      color="accent"
      label="URL Link"
      :rules="[rules.url]"
      lazy-rules
      outlined
      dense
    )
      template(v-slot:append)
        q-icon(
          name="fas fa-link"
          size="xs"
        )
  fieldset.q-mt-sm
    legend Tokens
    .row.q-col-gutter-sm
      .col-xs-12.col-md-6
        q-input(
          ref="votingTokens"
          v-model="form.votingTokens"
          type="number"
          color="accent"
          label="Voting Tokens"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
          outlined
          dense
          @blur="form.votingTokens = parseFloat(form.votingTokens).toFixed(0)"
        )
      .col-xs-12.col-md-6
        q-input(
          ref="rewardTokens"
          v-model="form.rewardTokens"
          type="number"
          color="accent"
          label="Reward Tokens"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
          outlined
          dense
          @blur="form.rewardTokens = parseFloat(form.rewardTokens).toFixed(0)"
        )
  .text-center.q-mt-sm
    q-btn.q-mr-sm(
      label="Cancel"
      rounded
      color="grey"
      dense
      unelevated
      @click="hideForm"
    )
    q-btn(
      label="Save draft"
      rounded
      color="proposal"
      dense
      unelevated
      :loading="submitting"
      @click="onSaveDraft"
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
button
  width 30%
</style>
