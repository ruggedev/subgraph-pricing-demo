import { Address, BigDecimal, ethereum, log } from '@graphprotocol/graph-ts'
import { Chainlink, UniswapV2, UniswapV3, DefaultConfig } from '@ruggedhaha/subgraph-pricing-utils'
import { Test } from './generated/schema'

class ITest {
  id: string
  msg: BigDecimal | null
}
export function handleBlock(block: ethereum.Block): void {
  const config = DefaultConfig
  config.updateConfig(
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    null,
  )
  let tests: ITest[] = [
    {
      id: 'chainlink: ETH/USD',
      msg: Chainlink.getLastestPrice('0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'),
    },
    {
      id: 'uniswapV2: WETH/USDT',
      msg: UniswapV2.getTokenPrice([
        Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
        Address.fromString('0xdac17f958d2ee523a2206206994597c13d831ec7'),
      ]),
    },
    {
      id: 'sushi: WETH/USDT',
      msg: UniswapV2.getCustomTokenPrice(Address.fromString('0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'), [
        Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
        Address.fromString('0xdac17f958d2ee523a2206206994597c13d831ec7'),
      ]),
    },
    {
      id: 'uniswapV3: WETH/USDT',
      msg: UniswapV3.getPrice([
        Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
        Address.fromString('0xdac17f958d2ee523a2206206994597c13d831ec7'),
      ]),
    },
  ]

  for (let i = 0; i < tests.length; ++i) {
    let entity = Test.load(tests[i].id)
    if (entity === null) {
      entity = new Test(tests[i].id)
    }
    if (tests[i].msg) {
      entity.msg = tests[i].msg!.toString()
    } else {
      entity.msg = ''
    }
    entity.block = block.number
    entity.save()
  }
}
