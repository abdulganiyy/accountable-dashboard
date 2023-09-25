import { gql } from "@apollo/client";

export const NEW_MESSAGE = gql`subscription NewMessage($input: NewMessageInput!) {
  newMessage(input: $input) {
    message {
      attachment {
        name
        url
      }
      createdAt
      read
      recipient {
        email
        firstName
        lastName
      }
      sender {
        email
        firstName
        lastName
      }
      text
      updatedAt
    }
    recipient
  }
}`