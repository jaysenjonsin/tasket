//this file is setting up a Remote Procedure Call (RPC) client to interact with the API using the generated client from hono.
import { hc } from 'hono/client';

import { AppType } from '@/app/api/[[...route]]/route';

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
