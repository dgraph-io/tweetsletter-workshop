import React, { useState } from "react";

import BasicTweetView from './BasicTweetView';
import { ApolloProvider, ApolloClient } from '@apollo/client'
import { InMemoryCache } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

import "./App.css";

const GRAPHQL_URL = 'https://nutty-cake.us-west-2.aws.cloud.dgraph.io/graphql';

const App = () => {
  const [client, setClient] = useState(
    new ApolloClient({
      uri: GRAPHQL_URL,
      cache: new InMemoryCache()
    })
  );
  const [clientUpdated, setClientUpdated] = useState(false);

  const createAdminClient = async (token) => {
    const httpLink = createHttpLink({
      uri: GRAPHQL_URL,
      options: {
        reconnect: true,
      },
    });
  
    const authLink = setContext((_, { headers }) => {
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          "Authorization": token,
        },
      };
    });
  
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });

    setClientUpdated(true);
    setClient(client);
    console.log('updated')
  }

  return (
    <ApolloProvider client={client}>
      <BasicTweetView 
        authenticated={clientUpdated} 
        onKeyChange={createAdminClient}
      />
    </ApolloProvider>
  );
};

export default App;
