import type { CodegenConfig } from '@graphql-codegen/cli'
import loader from './codegen-loader'

const config: CodegenConfig = {
  // @ts-ignore as using filename here is broken due to bug in graphql-code-generator
  schema: [{ api: { loader } }],

  documents: 'gql/**/*.ts',
  ignoreNoDocuments: true,
  require: ['dotenv/config', 'ts-node/register'],
  generates: {
    'gen/gql/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
      },
    },
  },
}

export default config
