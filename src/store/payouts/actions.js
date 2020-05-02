export const saveContributionProposal = async function ({ commit, rootState }, { title, description, url, recipient, reward, votepow }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'create',
    data: {
      scope: 'proposal',
      names: [
        { key: 'type', value: 'payout' },
        { key: 'owner', value: rootState.accounts.account },
        { key: 'recipient', value: recipient },
        { key: 'trx_action_name', value: 'makepayout' }
      ],
      strings: [
        { key: 'title', value: title },
        { key: 'description', value: description },
        { key: 'url', value: url }
      ],
      assets: [
        { key: 'reward_amount', value: `${parseFloat(reward).toFixed(2)} REWARD` },
        { key: 'vote_amount', value: `${parseFloat(votepow).toFixed(2)} VOTEPOW` }
      ],
      time_points: [],
      ints: [],
      floats: [],
      trxs: []
    }
  }]

  return this.$api.signTransaction(actions)
}

export const fetchData = async function ({ commit, state }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'payout',
    table: 'objects',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].id : '',
    limit: state.list.pagination.limit,
    reverse: true
  })

  commit('addPayouts', result)
}
