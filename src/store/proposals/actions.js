import Turndown from 'turndown'

export const fetchProposal = async function (context, { id, isHistory }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: isHistory ? 'proparchive' : 'proposal',
    table: 'objects',
    lower_bound: parseInt(id),
    upper_bound: parseInt(id),
    limit: 1
  })

  if (result && result.rows.length) {
    return result.rows[0]
  }
  return null
}

export const fetchData = async function ({ commit, state }, { isHistory }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: isHistory ? 'proparchive' : 'proposal',
    table: 'objects',
    index_position: 5, // by created
    key_type: 'i64',
    limit: 1000
  })
  commit('addProposals', result)
}

export const closeProposal = async function (context, id) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'closeprop',
    data: {
      proposal_id: id
    }
  }]

  return this.$api.signTransaction(actions)
}

export const getUserProposals = async function (context, account) {
  let userProposals = []
  let more = true
  let results = { rows: [] }
  while (more) {
    results = await this.$api.getTableRows({
      code: this.$config.contracts.dao,
      scope: 'proposal',
      table: 'objects',
      lower_bound: results.rows.length ? parseInt(new Date(results.rows[results.rows.length - 1].created_date).getTime() / 1000) : null,
      limit: 1000,
      reverse: true
    })
    userProposals = userProposals.concat(results.rows.filter(r => {
      const obj = r.names.find(n => n.key === 'owner')
      return obj && obj.value === account
    }))
    more = results.more
  }
  return userProposals
}
export const saveProposal = async function ({ commit, rootState }, { title, description, url, rewardTokens, votingTokens }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'create',
    data: {
      scope: 'proposal',
      names: [
        { key: 'owner', value: rootState.accounts.account },
        { key: 'recipient', value: rootState.accounts.account }
      ],
      strings: [
        { key: 'title', value: title },
        { key: 'description', value: new Turndown().turndown(description) },
        { key: 'url', value: url }
      ],
      assets: [
        { key: 'reward_token_amount', value: `${parseFloat(rewardTokens).toFixed(2)} GBAR` },
        { key: 'vote_token_amount', value: `${parseFloat(votingTokens).toFixed(2)} GBAV` }
      ],
      time_points: [],
      ints: [],
      floats: [],
      trxs: []
    }
  }]

  return this.$api.signTransaction(actions)
}
