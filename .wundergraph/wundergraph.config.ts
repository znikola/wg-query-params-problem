import {
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
} from '@wundergraph/sdk';
import operations from './wundergraph.operations';
import server from './wundergraph.server';

const wizGood = introspect.openApi({
  apiNamespace: 'wizGood',
  source: {
    kind: 'file',
    filePath: './schema/swagger.json',
  },
  baseURL: new EnvironmentVariable(
    'WIZ',
    'https://wizard-world-api.herokuapp.com/'
  ),
  // statusCodeUnions: true,
});
const wizBad = introspect.openApi({
  apiNamespace: 'wizBad',
  source: {
    kind: 'file',
    filePath: './schema/swagger.json',
  },
  baseURL: new EnvironmentVariable(
    'WIZ',
    'https://wizard-world-api.herokuapp.com/'
  ),
  statusCodeUnions: true,
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [wizGood, wizBad],
  server,
  operations,
  generate: {
    codeGenerators: [],
    operationsGenerator: (config) => {
      config.includeNamespaces('wizGood', 'wizBad');
    },
  },
  experimental: {
    orm: false,
  },
  cors: {
    ...cors.allowAll,
  },
  security: {
    enableGraphQLEndpoint:
      process.env.NODE_ENV !== 'production' ||
      process.env.GITPOD_WORKSPACE_ID !== undefined,
  },
});
