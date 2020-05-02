<script>
import removeMd from 'remove-markdown'
import { format } from '~/mixins/format'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'role-card',
  mixins: [format],
  props: {
    role: { type: Object, required: true }
  },
  data () {
    return {
      profile: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    title () {
      const data = this.role.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    owner () {
      const data = this.role.names.find(o => o.key === 'owner')
      return (data && data.value) || ''
    },
    description () {
      const data = this.role.strings.find(o => o.key === 'description')
      if (data) {
        return removeMd(data.value).replace(/\n/g, ' ')
      }
      return ''
    }
  },
  async mounted () {
    this.profile = await this.getPublicProfile(this.owner)
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('profiles', ['getPublicProfile']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'roleView',
        data: this.role
      })
    },
    openApplicationForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentForm',
        data: {
          type: 'new',
          role: this.role
        }
      })
    }
  }
}
</script>

<template lang="pug">
q-card.role
  .ribbon
    span.text-white.bg-role NOW HIRING
  .type
    span ROLE
    q-icon(name="far fa-clipboard" size="xs")
  .column.fit.flex.justify-between
    div
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
        .title(@click="showCardFullContent") {{ title }}
      q-card-section.description
        p {{ description | truncate(110) }}
    div
      q-card-actions.q-pa-lg.flex.justify-around.role-actions
        q-btn(
          :disable="!isAuthenticated"
          label="Apply"
          color="assignment"
          @click="openApplicationForm"
          dense
          unelevated
        )
</template>

<style lang="stylus" scoped>
.role
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
.title
  cursor pointer
  text-align center
  font-size 20px
  font-weight 600
  color #605F60
  line-height 22px
  height 36px
.icon
  margin-top 20px
  width 100%
  max-width 100px
.role-actions
  button
    width 45%
</style>
