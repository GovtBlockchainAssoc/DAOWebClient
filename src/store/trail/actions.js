export const fetchBallot = async function ({ commit }, ballot) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: this.$config.contracts.decide,
    table: 'ballots',
    limit: 1,
    lower_bound: ballot,
    upper_bound: ballot
  })
  return result.rows.length && result.rows[0]
}

export const getSupply = async function () {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: this.$config.contracts.decide,
    table: 'treasuries',
    lower_bound: 'VOTEPOW',
    upper_bound: 'VOTEPOW'
  })
  if (result && result.rows.length) {
    return result.rows[0].supply
  }
  return 0
}

export const castVote = async function ({ rootState, commit }, { id, vote }) {
  const actions = [{
    account: this.$config.contracts.decide,
    name: 'castvote',
    data: {
      voter: rootState.accounts.account,
      ballot_name: id,
      options: [vote]
    }
  }]
  return this.$api.signTransaction(actions)
}

export const getUserVote = async function (context, { user, ballot }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: ballot,
    table: 'votes',
    lower_bound: user,
    upper_bound: user
  })
  if (result && result.rows.length) {
    return result.rows[0].weighted_votes.some(v => v.key === 'pass') ? 'pass' : 'fail'
  }
  return null
}
