import DelegateStakesNodesMainnet from "./delegate-stakes-nodes-mainnet"
import DelegateStakesNodesTestnet from "./delegate-stakes-nodes-testnet"

export default {

    name: "PandoraPay",
    title: 'PandoraPay',
    entity: 'PandoraPay',
    version: '0.125',

    fallback: 'http://helloworldx.ddns.net:8083',
    fallbackChatServer: 'http://helloworldx.ddns.net:9093',
    delegateStakesNodes: DelegateStakesNodesMainnet,

    fallback: 'http://127.0.0.1:8084',
    fallbackChatServer: 'http://127.0.0.1:9093',
    delegateStakesNodes: DelegateStakesNodesTestnet,

}