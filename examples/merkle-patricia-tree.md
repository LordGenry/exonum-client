# Verify a Merkle Patricia tree

An example of verifying a Merkle Patricia tree:

```javascript
const rootHash = '30d4490ced707b82df58490954eb650c4a1ab4f372db79a94e0aa17d53b80a57'
const proofNode = {
  '0010100000011111100101111010100101100110100000010001101000001011001011101111011001100000100110010111001111110000110110000101100000111010110010000101111101010011101100111001010110110001001100011000111110010100110101100111110110110010100001101110011101000001': 'ee41de52614bf7231722361886627d7c3a45c7d463b866355775fe810cd28c79',
  '1': {
    '011100011100101100010101110100010101110111100101010000001010111110011110100111111000111101101011101010111101100001011011001000111111010001001000111011101010000011000110010101101110110011010100010111001111100010001001111110111100000110010101111101010011001': {
      val: {
        firstName: 'John',
        lastName: 'Doe',
        age: 28,
        balance: 2500
      }
    },
    '111000111101010100001011111001101100110011100111010100110101000110100100010011010111101010011000011101110100001001001001000100110100001011111011011111011100000001110001010111011100001110011001100111000011010000001101011000101100111011000100010001110101111': '2d72ab9dd43b7d0ddf2caf8e1afb90cdf60dafad3d55cbbaab7cc96a55bc4f2e'
  }
}
const key = 'f1ea85f36673a9a8d226bd4c3ba12489a17dbee038aee1ccce1a06b1676223af'
let user = Exonum.newType({
  size: 21,
  fields: {
    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
    lastName: {type: Exonum.String, size: 8, from: 8, to: 16},
    age: {type: Exonum.Uint8, size: 1, from: 16, to: 17},
    balance: {type: Exonum.Uint32, size: 4, from: 17, to: 21}
  }
})

let data = Exonum.merklePatriciaProof(rootHash, proofNode, key, user) // {firstName: 'John', lastName: 'Doe', age: 28, balance: 2500}
```

An example of verifying a Merkle Patricia tree with data passed as byte array:

```javascript
const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd5b'
const proofNode = {
  '0': {
    '0': {
      '0': 'caae9df1efefea2759ae0a3b517d3349706d8784332c2f62c9a098e844165d89',
      '1': {
        '0': {
          '0': '380b4b821be12d1dfd358182221db9a6a99bcb170352ef35a29f07c2bcff38b3',
          '1': {
            '00111011111011001100000101010100010110001001111100100011100101001100100100100000000100100110101111010000111010101100100101000101000011111011000000001110011101011100011101110110000010100101101010001110001000111101100000101010111001100110010010101110111': 'c68961128777db1d16eefeed4c34db888537e11988d1a374578465b6331275fc',
            '10': {
              '001010001111110000101101101011111110000101010111001100101110011110010011110000111001011111111011110110100101111111111110111001110011111110011111001110011110111100001100100101110011010010111111011110001001000010000110000001000101101111100000101010100': '4bd3fa4310bed5820402d911d1eccbb707061ec8d289e5729d45b56c8fef4c03',
              '111010101101111001100001101010000101000000010001000101001111010011000011111100001110100101011111001111101011010100011101111000110001011011010101010110101000011111000110101111100111001110001111010101111011010011011011000001001001111111100110111000011': {
                val: [36, 49, 15, 31, 163, 171, 247, 217]
              }
            }
          }
        },
        '1': '7b30199821f2250fcbe03a65c09e1709a9aa34b16cb99959f10b4e3b21da95b6'
      }
    },
    '1': 'a69f434e1c3169ebf6c7bff7ca75ede523509ae0f5049d6d91bc3dcc334b6023'
  },
  '1': 'fcfbcd07563e3f04f731a754b92947efbbe6c579667a7cc235c3ee6b2a0bffb0'
}
const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

let data = Exonum.merklePatriciaProof(rootHash, proofNode, key) // [36, 49, 15, 31, 163, 171, 247, 217]
```