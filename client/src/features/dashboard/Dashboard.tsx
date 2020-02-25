import React, { useEffect } from 'react';

export const Dashboard = () => {
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: "{ questions { id content } }"})
    })
      .then(r => r.json())
      .then(data => console.log('data returned:', data));
  })
  return (
    <h1>Dashboard</h1>
  )
}
