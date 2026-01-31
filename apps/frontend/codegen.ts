
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://localhost:4000/graphql',
    documents: ['apps/frontend/src/**/*.{ts,tsx}'],
    generates: {
        'apps/frontend/src/gql/': {
            preset: 'client',
            plugins: [],
        },
    },
};

export default config;
