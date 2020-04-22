<script>
import { uid } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import PeriodSelect from '~/components/form/period-select'

const defaultDesc = 'Please describe in a paragraph or two why you are getting this payout.  We recommend to add a link to other supporting documents in the text box below.'

export default {
  name: 'payout-form',
  mixins: [forms, validation],
  components: { PeriodSelect },
  props: {
    draft: { type: Object }
  },
  data () {
    return {
      form: {
        id: uid(),
        title: null,
        description: defaultDesc,
        recipient: null,
        url: null,
        votepow: 0,
        reward: 0
      },
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periodOptionsStartContribution']),
    ...mapGetters('accounts', ['account']),
    ...mapGetters('profiles', ['isConnected'])
  },
  mounted () {
    this.form.recipient = this.account
  },
  methods: {
    ...mapActions('profiles', ['saveDraft', 'connectProfileApi']),
    ...mapActions('payouts', ['saveProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onSaveDraft () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      if (!this.isConnected) {
        await this.connectProfileApi()
      }
      const success = await this.saveDraft({ type: 'contribution', draft: this.form })
      if (success) {
        await this.reset()
        this.hideForm()
        if (this.$route.path !== '/proposals/contribution') {
          await this.$router.push({ path: '/proposals/contribution' })
        }
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        id: uid(),
        title: null,
        description: defaultDesc,
        recipient: null,
        url: null,
        votepow: 0,
        reward: 0
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
    legend Payout
    p Please enter your vote power and reward for this contribution.
    .row.q-col-gutter-xs
      .col-xs-12.col-md-6
        q-input(
          ref="votepow"
          v-model="form.votepow"
          type="number"
          color="accent"
          label="VOTEPOW"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
          outlined
          dense
          @blur="form.votepow = parseFloat(form.votepow).toFixed(0)"
        )
      .col-xs-12.col-md-6
        q-input(
          ref="reward"
          v-model="form.reward"
          type="number"
          color="accent"
          label="Reward"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
          outlined
          dense
          @blur="form.reward = parseFloat(form.reward).toFixed(0)"
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
      color="green"
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
