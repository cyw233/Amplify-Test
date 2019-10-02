import API, { graphqlOperation } from '@aws-amplify/api'
import Amplify, { Auth } from 'aws-amplify';
import PubSub from '@aws-amplify/pubsub';
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'

import awsconfig from './aws-exports';
import { onCreateTodo } from './graphql/subscriptions'

Amplify.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

async function createNewTodo() {
  const todo = { name: "Use AppSync", description: "Realtime and Offline" }
  return await API.graphql(graphqlOperation(createTodo, { input: todo }))
}

const MutationButton = document.getElementById('MutationEventButton');
const MutationResult = document.getElementById('MutationResult');

MutationButton.addEventListener('click', (evt) => {
  MutationResult.innerHTML = `MUTATION RESULTS:`;
  createNewTodo().then((evt) => {
    MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`
  })
});

const QueryResult = document.getElementById('QueryResult');

async function getData() {
  QueryResult.innerHTML = `QUERY RESULTS`;
  API.graphql(graphqlOperation(listTodos)).then((evt) => {
    evt.data.listTodos.items.map((todo, i) =>
      QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`
    );
  })
}

getData();

const SubscriptionResult = document.getElementById('SubscriptionResult');

API.graphql(graphqlOperation(onCreateTodo)).subscribe({
  next: (evt) => {
    SubscriptionResult.innerHTML = `SUBSCRIPTION RESULTS`
    const todo = evt.value.data.onCreateTodo;
    SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`
  }
});

Auth.signIn({
  username: 'cb49f953-feed-43f0-9444-3db543327c6a', // Required, the username
  password: '123456789', // Optional, the password
  //validationData, // Optional, a random key-value pair map which can contain any key and will be passed to your PreAuthentication Lambda trigger as-is. It can be used to implement additional validations around authentication
}).then(user => console.log(user))
  .catch(err => console.log(err));

// Auth.signUp({
//   username: 'cyw233',
//   password: '123456',
//   attributes: {
//     //email: 'chenyangw233@gmail.com',          // optional
//     //phone_number: '0426823502',   // optional - E.164 number convention
//     // other custom attributes 
//   },
//   validationData: []  //optional
// })
//   .then(data => console.log(data))
//   .catch(err => console.log(err));

// After retrieving the confirmation code from the user
// Auth.confirmSignUp(username, code, {
//   // Optional. Force user confirmation irrespective of existing alias. By default set to True.
//   forceAliasCreation: true    
// }).then(data => console.log(data))
// .catch(err => console.log(err));

// Auth.resendSignUp(username).then(() => {
//   console.log('code resent successfully');
// }).catch(e => {
//   console.log(e);
// });

LogOutButton.addEventListener('click', (evt) => {
  Auth.signOut()
    .then(data => console.log("log out success"))
    .catch(err => console.log(err));
});