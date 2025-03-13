// This is a Server Component by default
// No 'use client' directive means it runs on the server
export default async function ServerComponent() {
  // This data fetching happens on the server
  const data = await fetch('https://api.example.com/data').then((res) =>
    res.json()
  );

  return (
    <div>
      <h1>Server Component</h1>
      <p>Data fetched on server: {data.title}</p>
      <ClientComponent data={data} />
    </div>
  );
}

// This is a Client Component
('use client');
import { useState } from 'react';

export function ClientComponent({ data }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Client Component</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Received data from server: {data.title}</p>
    </div>
  );
}

// Example of a Server Component with database access
export async function DatabaseComponent() {
  // This runs on the server
  const users = await db.users.findMany();

  return (
    <div>
      <h2>Users from Database</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

// Example of a Server Component with file system access
export async function FileSystemComponent() {
  // This runs on the server
  const fs = require('fs');
  const fileContent = await fs.promises.readFile('./data.txt', 'utf-8');

  return (
    <div>
      <h2>File Content</h2>
      <pre>{fileContent}</pre>
    </div>
  );
}
