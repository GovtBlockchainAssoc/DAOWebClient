<script>
import { format } from '~/mixins/format'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'assignment-card',
  mixins: [format],
  props: {
    assignment: { type: Object, required: true },
    readonly: { type: Boolean, required: false }
  },
  data () {
    return {
      role: null,
      profile: null,
      details: false
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('roles', ['fetchRole']),
    ...mapActions('profiles', ['getPublicProfile']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentView',
        data: {
          role: this.role,
          assignment: this.assignment
        }
      })
    }
  },
  async mounted () {
    this.role = await this.fetchRole(this.assignment.ints.find(i => i.key === 'role_id').value)
    this.profile = await this.getPublicProfile(this.owner)
  },
  computed: {
    title () {
      if (this.role) {
        return this.role.strings.find(s => s.key === 'title').value
      }
      return ''
    },
    owner () {
      const data = this.assignment.names.find(o => o.key === 'assigned_account')
      return (data && data.value) || ''
    }
  }
}
</script>

<template lang="pug">
q-card.assignment
  q-img.owner-avatar(
    v-if="profile && profile.publicData.avatar"
    :src="profile.publicData.avatar"
    @click="$router.push({ path: `/@${owner}`})"
  )
    q-tooltip {{ (profile.publicData && profile.publicData.name) || owner }}
  q-avatar.owner-avatar(
    v-else
    size="40px"
    color="teal"
    text-color="white"
    @click="$router.push({ path: `/@${owner}`})"
  )
    | {{ owner.slice(0, 2).toUpperCase() }}
    q-tooltip {{ (profile && profile.publicData && profile.publicData.name) || owner }}
  q-card-section.text-center.q-pb-sm
    img.icon(src="~assets/icons/assignments.svg")
  q-card-section
    .type(@click="showCardFullContent") Assignment
    .title(@click="showCardFullContent") {{ title }}
  q-card-actions.q-pa-lg(v-if="!readonly")
    q-btn.full-width(
      label="Review applicant"
      color="assignment"
      rounded
      dense
      unelevated
    )
</template>

<style lang="stylus" scoped>
.assignment
  width 300px
  border-radius 1rem
  margin 10px
.assignment:hover
  transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
  transform scale(1.2) translate(0px, 40px) !important
  -moz-transform scale(1.2) translate(0px, 40px)
  -webkit-transform scale(1.2) translate(0px, 40px)
  z-index 10
  box-shadow 0 4px 8px rgba(0,0,0,0.2), 0 5px 3px rgba(0,0,0,0.14), 0 3px 3px 3px rgba(0,0,0,0.12)
  .owner-avatar
    z-index 110
.owner-avatar
  cursor pointer
  position absolute
  border-radius 50% !important
  right 10px
  top 10px
  width 40px
.description
  white-space pre-wrap
  max-height 55px
  overflow auto
.type
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
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
.role-actions
  button
    width 45%
</style>
