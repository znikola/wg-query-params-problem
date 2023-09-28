import {
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
} from '@wundergraph/sdk';
import operations from './wundergraph.operations';
import server from './wundergraph.server';

const wiz = introspect.openApi({
  apiNamespace: 'wiz',
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

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [wiz],
  server,
  operations,
  generate: {
    codeGenerators: [],
    operationsGenerator: (config) => {
      config.includeNamespaces('wiz');
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
