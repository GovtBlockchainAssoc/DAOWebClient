<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import showdown from 'showdown'
import ImageProcessor from '~/components/form/image-processor'
import PhoneNumber from '~/components/form/phone-number'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import { timeZones } from '~/mixins/time-zones'

export default {
  name: 'profile-edit',
  components: { ImageProcessor, PhoneNumber },
  mixins: [forms, timeZones, validation],
  data () {
    return {
      isFullScreen: false,
      contactMethodOptions: [
        { value: 'EMAIL', label: 'Email' },
        { value: 'SMS', label: 'SMS' }
      ],
      timeZonesFilteredOptions: [],
      mainForm: {
        avatarFile: null,
        name: null,
        nickname: null,
        email: null,
        phoneNumber: null,
        contactMethod: null
      },
      aboutForm: {
        bio: 'Write 1-2 paragraphs about yourself so that people get to know you'
      },
      detailsForm: {
        coverFile: null,
        timeZone: null,
        tags: []
      },
      initPhoneNumber: null,
      avatarUrl: null,
      coverUrl: null,
      editAvatar: true,
      editCover: true,
      customField: null,
      splitter: 50,
      loading: true,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('profiles', ['isConnected']),
    ...mapGetters('accounts', ['account'])
  },
  async mounted () {
    this.timeZonesFilteredOptions = this.timeZonesOptions
    await this.loadProfile()
    this.loading = false
  },
  methods: {
    ...mapActions('profiles', ['saveProfile', 'getProfile']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('profiles', ['setView']),
    hideForm () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    },
    async loadProfile () {
      const profile = await this.getProfile(this.account)
      if (!profile) return
      this.mainForm.name = profile.publicData.name
      this.mainForm.nickname = profile.publicData.nickname
      this.mainForm.contactMethod = profile.commPref
      this.mainForm.email = profile.emailInfo.value
      this.initPhoneNumber = profile.smsInfo.value

      this.detailsForm.timeZone = profile.publicData.timeZone
      this.detailsForm.tags = profile.publicData.tags

      if (profile.publicData.bio) {
        const converter = new showdown.Converter()
        this.aboutForm.bio = converter.makeHtml(profile.publicData.bio)
      }

      this.avatarUrl = profile.publicData.avatar
      this.coverUrl = profile.publicData.cover
      this.editAvatar = !profile.publicData.avatar
      this.editCover = !profile.publicData.cover
    },
    filterTimeZones (val, update) {
      if (val === '') {
        update(() => {
          this.timeZonesFilteredOptions = this.timeZonesOptions
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.timeZonesFilteredOptions = this.timeZonesOptions.filter(
          v => v.text.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    async onSubmit () {
      this.resetValidation(this.mainForm)
      if (!(await this.validate(this.mainForm))) return
      this.submitting = true
      if (this.$refs.profileAvatar) {
        this.mainForm.avatarFile = await this.$refs.profileAvatar.getBlob()
      }
      if (this.$refs.profileCover) {
        this.detailsForm.coverFile = await this.$refs.profileCover.getBlob()
      }
      await this.saveProfile({
        mainForm: this.mainForm,
        aboutForm: this.aboutForm,
        detailsForm: this.detailsForm
      })
      this.setView(await this.getProfile(this.account))
      this.hideForm()
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  q-input(
    ref="name"
    v-model="mainForm.name"
    color="accent"
    label="Name"
    maxlength="200"
    :rules="[rules.required]"
    lazy-rules
    outlined
    dense
  )
  q-input(
    ref="nickname"
    v-model="mainForm.nickname"
    color="accent"
    label="Nickname"
    maxlength="200"
    :rules="[rules.required]"
    lazy-rules
    outlined
    dense
  )
  q-editor(
    v-model="aboutForm.bio"
    :fullscreen.sync="isFullScreen"
    min-height="100px"
    max-height="250px"
    :toolbar="isFullScreen ? fullScreenToolbar : defaultToolbar"
  )
  fieldset.q-mt-sm
    legend More information
    q-input(
      ref="email"
      v-model="mainForm.email"
      :label="`Email${mainForm.contactMethod === 'EMAIL' ? '*' : ''}`"
      :rules="[rules.requiredIf(mainForm.contactMethod === 'EMAIL')]"
      lazy-rules
    )
    phone-number(
      ref="phoneNumber"
      :value.sync="mainForm.phoneNumber"
      :init-value="initPhoneNumber"
      :required="mainForm.contactMethod === 'SMS'"
    )
    q-select(
      ref="contactMethod"
      v-model="mainForm.contactMethod"
      label="Preferred contact method*"
      :options="contactMethodOptions"
      map-options
      emit-value
      :rules="[rules.required]"
      lazy-rules
    )
    q-select(
      v-model='detailsForm.timeZone'
      use-input
      label="Time zone"
      :options="timeZonesFilteredOptions"
      @filter="filterTimeZones"
      option-value="value"
      option-label="text"
      emit-value,
      map-options
    )
    q-select(
      v-model="detailsForm.tags"
      label="Tags"
      use-input
      use-chips
      multiple
      hide-dropdown-icon
      new-value-mode='add-unique'
    )
  fieldset.q-mt-sm.relative-position
    legend Avatar
    .absolute(
      v-show="!editAvatar"
      :style="{zIndex: 10, top: '5px', right: 0}"
    )
      q-btn(
        icon="edit"
        @click="editAvatar = true"
        size="sm"
        color="accent"
        dense
        flat
        round
      )
    image-processor(
      v-show="editAvatar"
      ref="profileAvatar"
      :width="200"
      :height="200"
      round
      @cancel="editAvatar = false"
    )
    .text-center(v-show="!editAvatar")
      img.profile-avatar(:src="avatarUrl")
  // -
    fieldset.q-mt-sm.relative-position
      legend Cover
      .absolute(
        v-show="!editCover"
        :style="{zIndex: 10, top: '5px', right: 0}"
      )
        q-btn(
          icon="edit"
          @click="editCover = true"
          size="sm"
          color="accent"
          dense
          flat
          round
        )
      image-processor(
        v-show="editCover"
        ref="profileCover"
        :width="1200"
        :height="200"
        @cancel="editCover = false"
      )
      .text-center.q-mt-xs(v-show="!editCover")
        img.profile-cover(:src="coverUrl")
  //
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
      label="Save"
      color="primary"
      @click="onSubmit"
      :loading="submitting"
      :disable="loading"
      rounded
      dense
      unelevated
    )
  q-inner-loading(:showing="loading")
    q-spinner-dots(
      color="primary"
      size="60px"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
.profile-avatar
  border 2px solid $primary
  border-radius 50%
.profile-cover
  width 100%
.md-hint
  text-decoration none
  color $primary
button
  width 30%
</style>
