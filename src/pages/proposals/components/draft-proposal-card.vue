<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import removeMd from 'remove-markdown'
import { format } from '~/mixins/format'

export default {
  name: 'draft-proposal-card',
  mixins: [format],
  props: {
    draft: { type: Object, required: true },
    type: { type: String, required: true }
  },
  data () {
    return {
      loading: true,
      details: false,
      profile: null,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    description () {
      if (this.draft.description) {
        return removeMd(this.draft.description).replace(/\n/g, ' ')
      }
      return ''
    },
    title () {
      if (this.draft.role) {
        const data = this.draft.role.strings.find(s => s.key === 'title')
        if (data) {
          return data.value
        }
      }
      return this.draft.title
    }
  },
  async mounted () {
    this.profile = await this.getPublicProfile(this.account)
    this.loading = false
  },
  methods: {
    ...mapMutations('proposals', ['clearData']),
    ...mapActions('proposals', ['saveProposal']),
    ...mapActions('profiles', ['getPublicProfile', 'deleteDraft']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    openUrl () {
      window.open(this.draft.url)
    },
    editDraft () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: `${this.type}Form`,
        data: this.draft
      })
    },
    async onSaveProposal () {
      this.submitting = true
      await this.saveProposal(this.draft)
      await this.deleteDraft(this.draft.id)
      this.submitting = false
      this.clearData()
    }
  }
}
</script>

<template lang="pug">
q-card.draft
  .ribbon
    span.text-white.bg-draft DRAFTING
  .url(v-if="draft.url")
    q-btn(
      icon="fas fa-bookmark"
      @click="openUrl"
      flat
      color="draft"
      unelevated
      dense
    )
  .type
    span DRAFT
    q-icon(name="far fa-clipboard" size="xs")
  q-img.owner-avatar(
    v-if="profile && profile.publicData.avatar"
    :src="profile.publicData.avatar"
    @click="$router.push({ path: `/@${account}`})"
  )
    q-tooltip {{ (profile.publicData && profile.publicData.name) || account }}
  q-avatar.owner-avatar(
    v-else
    size="90px"
    color="teal"
    text-color="white"
    @click="$router.push({ path: `/@${account}`})"
  )
    | {{ account.slice(0, 2).toUpperCase() }}
    q-tooltip {{ (profile && profile.publicData && profile.publicData.name) || account }}
  .username {{ (profile && profile.publicData && profile.publicData.name) || owner }}
  q-btn.card-menu(
    icon="fas fa-ellipsis-v"
    color="grey"
    flat
    dense
    round
    no-caps
    :ripple="false"
    style="width:40px;height:40px;margin: 4px;"
  )
    q-menu
      q-list(dense)
        q-item(
          clickable
          v-close-popup
          @click="editDraft"
        )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-pencil-alt" size="14px")
          q-item-section Edit
        q-item(
          clickable
          v-close-popup
          @click="deleteDraft(draft.id)"
        )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-trash-alt" size="14px")
          q-item-section Delete
  q-card-section
    .title {{ title }}
  q-card-section.description
    p {{ description | truncate(110) }}
  q-card-actions.q-pa-lg.flex.justify-around.draft-actions
    q-btn(
      label="Propose"
      color="draft"
      rounded
      dense
      unelevated
      :loading="submitting"
    )
      q-popup-proxy
        .confirm.column.q-pa-sm
          | Are you sure you want to publish this proposal? There are no more edits possible after this action.
          .row.flex.justify-between.q-mt-sm
            q-btn(
              color="primary"
              label="No"
              dense
              flat
              v-close-popup
            )
            q-btn(
              color="primary"
              label="Yes"
              dense
              @click="onSaveProposal"
              v-close-popup
            )
</template>

<style lang="stylus" scoped>
.confirm
  min-height 100px
  max-width 250px
.draft
  width 300px
  border-radius 3px
  margin 10px
.card-menu
  position absolute
  right -10px
  top -5px
  width 20px
  z-index 110
  /deep/.q-focus-helper
    display none !important
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
  right 25px
  font-weight 600
  font-size 16px
  i
    margin-left 10px
    margin-top -4px
.title
  cursor pointer
  text-align center
  font-size 20px
  color $grey-6
  line-height 22px
.icon
  margin-top 20px
  width 100%
  max-width 100px
.url
  position absolute
  top -4px
  left 70px
  z-index 12
.draft-actions
  margin-top 55px
  button
    width 45%
    font-weight 700
</style>
