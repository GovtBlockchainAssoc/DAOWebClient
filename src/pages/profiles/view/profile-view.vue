<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { timeZones } from '~/mixins/time-zones'

export default {
  name: 'page-profile-view',
  mixins: [timeZones],
  data () {
    return {
      loading: true,
      submitting: false,
      timeZone: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('profiles', ['isConnected', 'profile']),
    isOwner () {
      return this.$route.params.username === this.account
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile', 'connectProfileApi']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('profiles', ['setView']),
    async onEdit () {
      if (!this.isConnected) {
        this.submitting = true
        await this.connectProfileApi()
        this.submitting = false
      }
      this.setShowRightSidebar(true)
      this.setRightSidebarType('profileForm')
    }
  },
  async mounted () {
    this.setView(null)
    this.setView(await this.getPublicProfile(this.$route.params.username))
    this.loading = false
  },
  watch: {
    profile: {
      immediate: true,
      handler (val) {
        if (val) {
          const tz = this.timeZonesOptions.find(v => v.value === val.publicData.timeZone)
          if (tz) {
            this.timeZone = tz.text
          }
        }
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg.relative-position(:style-fn="breadcrumbsTweak")
  div(v-if="profile")
    div.profile-cover.relative-position(
      :style="{ background: `url(${profile.publicData.cover}) no-repeat #00bfdf` }"
    )
      img.profile-avatar(
        v-if="profile.publicData.avatar"
        :src="profile.publicData.avatar"
      )
      q-avatar.profile-avatar-default(
        v-else
        size="200px"
        color="accent"
        text-color="white"
      )
        | {{ $route.params.username.slice(0, 2).toUpperCase() }}
      .absolute.connection-hint(v-if="isOwner && !isConnected")
        i You need to sign a login transaction before submitting your profile information
      q-btn.absolute-top-right.q-mr-sm.q-mt-sm(
        v-if="isOwner"
        color="primary"
        :label="isConnected ? 'Edit' : 'Connect and edit'"
        @click="onEdit"
        :loading="submitting"
      )
    .flex.justify-center.q-mb-md
      .column.text-center
        .text-h4 {{ profile.publicData.name }} ({{ $route.params.username }})
        div
          q-chip(v-for="(tag, idx) in profile.publicData.tags" :key="idx" dense color="primary" text-color="white") {{ tag }}
    .row.q-col-gutter-md
      .col-xs-12.col-md-6
        q-card(flat)
          q-card-section(
            v-for="(field, idx) in profile.publicData.customFields"
            :key="`custom_${idx}`"
          )
            strong.q-mr-md {{ field.label }}
            i {{ field.value }}
          q-card-section(v-if="timeZone")
            strong.q-mr-md Timezone
            i {{ timeZone }}
      .col-xs-12.col-md-6
        q-card(v-if="profile.publicData.bio")
          q-card-section
            .text-h6 Bio
          q-separator
          q-card-section
            q-markdown.fit.q-pa-sm(:src="profile.publicData.bio")
  div(v-else)
    .text-center(v-if="isOwner") You haven't created your profile yet. Click on the edit button and tell us more about yourself.
    .text-center(v-else) The user doesn't have a profile yet
    .text-center(v-if="isOwner")
      .connection-hint(v-if="!isConnected")
        i You need to sign a login transaction before submitting your profile information
      q-btn.absolute-top-right.q-mr-sm.q-mt-sm(
        color="primary"
        :label="isConnected ? 'Edit' : 'Connect and edit'"
        @click="onEdit"
        :loading="submitting"
      )
  q-inner-loading(:showing="loading")
    q-spinner-dots(
      color="primary"
      size="60px"
    )
</template>

<style lang="stylus" scoped>
.connection-hint
  font-size 11px
  font-style italic
  right 40px
  bottom -20px
.profile-cover
  height 200px
  width calc(100% + 48px)
  margin -24px
  background-size cover !important
  text-align center
  margin-bottom 110px
  background-color $secondary
.profile-avatar
  border 2px solid $primary
  border-radius 50%
  margin-top 100px
.profile-avatar-default
  margin-top 100px
</style>
