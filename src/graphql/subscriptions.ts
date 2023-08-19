/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateFollow = /* GraphQL */ `
  subscription OnCreateFollow(
    $filter: ModelSubscriptionFollowFilterInput
    $following_id: String
  ) {
    onCreateFollow(filter: $filter, following_id: $following_id) {
      id
      following_id
      followed_id
      status
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateFollow = /* GraphQL */ `
  subscription OnUpdateFollow(
    $filter: ModelSubscriptionFollowFilterInput
    $following_id: String
  ) {
    onUpdateFollow(filter: $filter, following_id: $following_id) {
      id
      following_id
      followed_id
      status
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteFollow = /* GraphQL */ `
  subscription OnDeleteFollow(
    $filter: ModelSubscriptionFollowFilterInput
    $following_id: String
  ) {
    onDeleteFollow(filter: $filter, following_id: $following_id) {
      id
      following_id
      followed_id
      status
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $id: String
    $owner: String
  ) {
    onCreateUser(filter: $filter, id: $id, owner: $owner) {
      id
      username
      email
      profile_photo
      privacy_status
      bio
      lists {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $id: String
    $owner: String
  ) {
    onUpdateUser(filter: $filter, id: $id, owner: $owner) {
      id
      username
      email
      profile_photo
      privacy_status
      bio
      lists {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $id: String
    $owner: String
  ) {
    onDeleteUser(filter: $filter, id: $id, owner: $owner) {
      id
      username
      email
      profile_photo
      privacy_status
      bio
      lists {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateList = /* GraphQL */ `
  subscription OnCreateList(
    $filter: ModelSubscriptionListFilterInput
    $user_id: String
  ) {
    onCreateList(filter: $filter, user_id: $user_id) {
      id
      title
      description
      image
      status
      user_id
      items {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateList = /* GraphQL */ `
  subscription OnUpdateList(
    $filter: ModelSubscriptionListFilterInput
    $user_id: String
  ) {
    onUpdateList(filter: $filter, user_id: $user_id) {
      id
      title
      description
      image
      status
      user_id
      items {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteList = /* GraphQL */ `
  subscription OnDeleteList(
    $filter: ModelSubscriptionListFilterInput
    $user_id: String
  ) {
    onDeleteList(filter: $filter, user_id: $user_id) {
      id
      title
      description
      image
      status
      user_id
      items {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateListItem = /* GraphQL */ `
  subscription OnCreateListItem(
    $filter: ModelSubscriptionListItemFilterInput
    $user_id: String
  ) {
    onCreateListItem(filter: $filter, user_id: $user_id) {
      id
      title
      description
      hyperlink
      rating
      image
      list_id
      createdAt
      updatedAt
      user_id
    }
  }
`;
export const onUpdateListItem = /* GraphQL */ `
  subscription OnUpdateListItem(
    $filter: ModelSubscriptionListItemFilterInput
    $user_id: String
  ) {
    onUpdateListItem(filter: $filter, user_id: $user_id) {
      id
      title
      description
      hyperlink
      rating
      image
      list_id
      createdAt
      updatedAt
      user_id
    }
  }
`;
export const onDeleteListItem = /* GraphQL */ `
  subscription OnDeleteListItem(
    $filter: ModelSubscriptionListItemFilterInput
    $user_id: String
  ) {
    onDeleteListItem(filter: $filter, user_id: $user_id) {
      id
      title
      description
      hyperlink
      rating
      image
      list_id
      createdAt
      updatedAt
      user_id
    }
  }
`;
