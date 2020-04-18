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

export const fetchData = async function ({ commit, state }, { type, roleId, isHistory }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: isHistory ? 'proparchive' : 'proposal',
    table: 'objects',
    lower_bound: type,
    upper_bound: type,
    index_position: 5, // by created
    key_type: 'i64',
    limit: 1000
  })
  if (result.rows && roleId) {
    result.rows = result.rows.filter(r => {
      const rId = r.ints.find(i => i.key === 'role_id')
      return rId && rId.value === parseInt(roleId)
    })
  }
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
