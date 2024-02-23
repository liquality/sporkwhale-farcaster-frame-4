// Configurations for the app
export const QUESTION_ID = 1

export const SUPPORTED_CHANNELS: Array<{
  id: number
  question_id: number
  name: string
  followers: number
}> = [
  { id: 1, question_id: 1, name: 'new-york', followers: 23000 },
  { id: 2, question_id: 1, name: 'los-angeles', followers: 1300 },
  { id: 3, question_id: 1, name: 'nouns', followers: 54500 },
  { id: 4, question_id: 1, name: 'mfers', followers: 4200 },
  { id: 5, question_id: 1, name: 'base', followers: 110000 },
  { id: 6, question_id: 1, name: 'zora', followers: 14700 },
  { id: 7, question_id: 1, name: 'op-stack', followers: 21700 },
  { id: 8, question_id: 1, name: 'solana', followers: 4200 },
  { id: 9, question_id: 1, name: 'perl', followers: 13100 },
  { id: 10, question_id: 1, name: 'farcats', followers: 1600 },
  { id: 11, question_id: 1, name: 'founders', followers: 62400 },
  { id: 12, question_id: 1, name: 'fc-devs', followers: 2800 },
  { id: 13, question_id: 1, name: 'seedclub', followers: 2800 },
  { id: 14, question_id: 1, name: 'skininthegame', followers: 6400 },
  { id: 15, question_id: 1, name: 'degen', followers: 32300 },
  { id: 16, question_id: 1, name: 'memes', followers: 100000 },
  { id: 17, question_id: 1, name: 'ted', followers: 6600 },
  { id: 18, question_id: 1, name: 'cameron', followers: 3400 },
  { id: 19, question_id: 1, name: 'avc', followers: 1400 },
  { id: 20, question_id: 1, name: 'orange-dao', followers: 1300 },
  { id: 21, question_id: 1, name: 'purple', followers: 5600 },
  { id: 22, question_id: 1, name: 'yellow', followers: 5900 },
  { id: 23, question_id: 1, name: 'layer3', followers: 5200 },
  { id: 24, question_id: 1, name: 'daylight', followers: 2900 },
  { id: 25, question_id: 1, name: 'fitness', followers: 26600 },
  { id: 26, question_id: 1, name: '10k', followers: 320 },
  { id: 27, question_id: 1, name: 'base-god', followers: 1500 },
  { id: 28, question_id: 1, name: 'dog', followers: 3500 },
  { id: 29, question_id: 1, name: 'backend', followers: 5900 },
  { id: 30, question_id: 1, name: 'frontend', followers: 45100 },
  { id: 31, question_id: 1, name: 'farcasther', followers: 5200 },
  { id: 32, question_id: 1, name: 'farcasthim', followers: 1000 },
]

export const COLLECTIVE_ABI = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_tokenContracts',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_honeyPots',
        type: 'address[]',
      },
    ],
    name: 'createPools',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'honeyPot',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'initiator',
        type: 'address',
      },
    ],
    name: 'PoolAdded',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'pools',
    outputs: [
      {
        internalType: 'address',
        name: 'id',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_participant',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_quantity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amountPaid',
        type: 'uint256',
      },
    ],
    name: 'recordPoolMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const COLLECTIVE_FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_initiator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_operator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_salt',
        type: 'uint256',
      },
    ],
    name: 'createCollective',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_initiator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_operator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_salt',
        type: 'uint256',
      },
    ],
    name: 'createWallet',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_collective',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_operator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_salt',
        type: 'uint256',
      },
    ],
    name: 'getCWallet',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_initiator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_operator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_salt',
        type: 'uint256',
      },
    ],
    name: 'getCollective',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const HONEYPOT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'ERC1967InvalidImplementation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ERC1967NonPayable',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'HoneyPot__OnlyOperator',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'HoneyPot__RewardFailedToSend',
    type: 'error',
  },
  {
    inputs: [],
    name: 'HoneyPot__TopContributorNotSet',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UUPSUnauthorizedCallContext',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'slot',
        type: 'bytes32',
      },
    ],
    name: 'UUPSUnsupportedProxiableUUID',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'RewardReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'topContributor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardValue',
        type: 'uint256',
      },
    ],
    name: 'RewardSent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'topContributor',
        type: 'address',
      },
    ],
    name: 'TopContributorSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOperator',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTopContributor',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_operator',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'sendReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_topContributor',
        type: 'address',
      },
    ],
    name: 'setTopContributor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]

export const POOL_ABI = [
  {
    inputs: [],
    name: 'collective',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'distributeReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getParticipants',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getParticipantsCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPoolInfo',
    outputs: [
      {
        internalType: 'address',
        name: '_tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_reward',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_rewardDistributed',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_totalContributions',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_isRewardReceived',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_isDistributed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isDistributed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isPoolActive',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isRewardReceived',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'participantData',
    outputs: [
      {
        internalType: 'address',
        name: 'id',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'contribution',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'rewardedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rewardAvailable',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'participants',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolInitiator',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolReward',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_participant',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_quantity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amountPaid',
        type: 'uint256',
      },
    ],
    name: 'recordMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardDistributed',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenContract',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalContributions',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenContract',
        type: 'address',
      },
    ],
    name: 'withdrawERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawNative',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_participant',
        type: 'address',
      },
    ],
    name: 'withdrawReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]

export const C_WALLET_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'dest',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'func',
        type: 'bytes',
      },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'dest',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'value',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'func',
        type: 'bytes[]',
      },
    ],
    name: 'executeBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const COLLECTIVE_FACTORY = '0x288fFC62c3f4142C618B7D109E0Cf0405766F25E'
export const HONEYPOT = '0xd56672EF513dcfCEc7eE0e4CA342bd344e03a3c3'
export const ENTRYPOINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'
