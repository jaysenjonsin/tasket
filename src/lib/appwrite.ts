import 'server-only'; //this file is only used on the server - using npm package server-only to ensure that the file is only used on the server

import { Account, Client, Databases, Storage, Users } from 'node-appwrite';

//admin client: used for admin actions like creating a new account
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}
