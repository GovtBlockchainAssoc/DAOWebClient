export default async ({ store }) => {
  const contracts = {
    dao: process.env.DAO_CONTRACT,
    decide: null,
    reward: null
  }
  const result = await store.$api.getTableRows({
    code: process.env.DAO_CONTRACT,
    scope: process.env.DAO_CONTRACT,
    table: 'config'
  })
  if (result && result.rows.length) {
    contracts.decide = result.rows[0].names.find(o => o.key === 'telos_decide_contract').value
    contracts.reward = result.rows[0].names.find(o => o.key === 'reward_token_contract').value
  }

  store['$config'] = {
    contracts
  }
}
