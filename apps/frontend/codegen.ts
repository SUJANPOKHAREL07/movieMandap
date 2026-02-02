
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: '../../backend/src/graphql/schema/*.ts',
    documents: ['src/**/*.{ts,tsx}'],
    generates: {
        'src/gql/': {
            preset: 'client',
            plugins: [],
        },
    },
};

export default config;
