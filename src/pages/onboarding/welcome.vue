<script>
export default {
  name: 'page-welcome'
}
</script>

<template lang="pug">
q-page.flex.flex-center.column
  transition(
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  )
    div
      .title
        strong.text-deep-orange-8 Ignite&nbsp;
        strong GBA
  .content.q-pa-md
    .content-title Welcome to GBA DAO!
    p The DHO (Decentralized Human Organization) is a framework to build your organization from the ground up in an organic and participative way and together with others. We focus on two core functions at this point, decentralized payroll and distribution accounting for organizational and bioregional contexts.
    q-btn.begin-journey(
      icon="far fa-compass"
      label="Begin your journey"
      to="/register"
      color="deep-orange-8"
      unelevated
      rounded
    )
    .content-bottom.q-mt-md
      | Already have an account?&nbsp;
      router-link(to="/login") Login here.
      br
      | &nbsp;Just visiting?&nbsp;
      router-link(to="/dashboard") Continue as guest
</template>

<style lang="stylus" scoped>
.title
  font-size 70px
  @media (max-width: $breakpoint-xs-max)
    letter-spacing -3px
    font-size 3.5em
    line-height 1.2
.subtitle
  font-size 22px
  @media (max-width: $breakpoint-xs-max)
    font-size 1em
    line-height 0.8
    padding-bottom 20px
.content
  text-align center
  max-width 450px
  border-radius 20px
  background rgba(255, 255, 255, 0.3)
  z-index 100
  @media (max-width: $breakpoint-xs-max)
    max-width 90%
  .content-title
    font-weight 600
    font-size 1.2em
    line-height 2em
  p
    min-width 460px
    @media (max-width: $breakpoint-xs-max)
      font-size 18px
      line-height 1.2em
      min-width auto
  .content-bottom
    font-size 12px
    a
      color black

@keyframes shadow-pulse {
  0% { box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2) }
  100% { box-shadow: 0 0 0 20px rgba(0, 0, 0, 0) }
}

.begin-journey
  animation: shadow-pulse 1s infinite
  font-size 1.2em
</style>
