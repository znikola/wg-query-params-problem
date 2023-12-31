import { createClient } from './.wundergraph/generated/client';

const client = createClient();

async function program() {
  const result = await client.query({
    operationName: 'wizBad/GetWizards',
    input: { FirstName: 'Tom', LastName: 'Riddle' },
  });
  console.log('result', result.data);
}

program();
