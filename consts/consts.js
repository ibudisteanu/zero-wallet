import DelegateStakesNodesMainnet from "./delegate-stakes-nodes-mainnet"
import DelegateStakesNodesTestnet from "./delegate-stakes-nodes-testnet"

export default {

    name: "PandoraPay",
    title: 'PandoraPay',
    entity: 'PandoraPay',
    version: '0.125',

    fallback: 'http://0.0.0.0:8085',
    delegateStakesNodes: DelegateStakesNodesMainnet,

}