/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type DeleteUserInput = {
  id: string,
};

export type ModelUserConditionInput = {
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  profile_photo?: ModelStringInput | null,
  privacy_status?: ModelPrivacyInput | null,
  bio?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelPrivacyInput = {
  eq?: Privacy | null,
  ne?: Privacy | null,
};

export enum Privacy {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}


export type User = {
  __typename: "User",
  id: string,
  username?: string | null,
  email?: string | null,
  profile_photo?: string | null,
  privacy_status: Privacy,
  bio?: string | null,
  lists?: ModelListConnection | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ModelListConnection = {
  __typename: "ModelListConnection",
  items:  Array<List | null >,
  nextToken?: string | null,
};

export type List = {
  __typename: "List",
  id: string,
  title: string,
  description: string,
  image?: string | null,
  status: string,
  user_id: string,
  items?: ModelListItemConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelListItemConnection = {
  __typename: "ModelListItemConnection",
  items:  Array<ListItem | null >,
  nextToken?: string | null,
};

export type ListItem = {
  __typename: "ListItem",
  id: string,
  title: string,
  description: string,
  hyperlink: string,
  rating?: number | null,
  image?: string | null,
  list_id: string,
  createdAt: string,
  updatedAt: string,
  user_id?: string | null,
};

export type CreateFollowInput = {
  id?: string | null,
  following_id: string,
  followed_id: string,
  status: FollowStatus,
};

export enum FollowStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}


export type ModelFollowConditionInput = {
  following_id?: ModelIDInput | null,
  followed_id?: ModelIDInput | null,
  status?: ModelFollowStatusInput | null,
  and?: Array< ModelFollowConditionInput | null > | null,
  or?: Array< ModelFollowConditionInput | null > | null,
  not?: ModelFollowConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelFollowStatusInput = {
  eq?: FollowStatus | null,
  ne?: FollowStatus | null,
};

export type Follow = {
  __typename: "Follow",
  id: string,
  following_id: string,
  followed_id: string,
  status: FollowStatus,
  createdAt: string,
  updatedAt: string,
};

export type UpdateFollowInput = {
  id: string,
  following_id?: string | null,
  followed_id?: string | null,
  status?: FollowStatus | null,
};

export type DeleteFollowInput = {
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  username?: string | null,
  email?: string | null,
  profile_photo?: string | null,
  privacy_status: Privacy,
  bio?: string | null,
};

export type UpdateUserInput = {
  id: string,
  username?: string | null,
  email?: string | null,
  profile_photo?: string | null,
  privacy_status?: Privacy | null,
  bio?: string | null,
};

export type CreateListInput = {
  id?: string | null,
  title: string,
  description: string,
  image?: string | null,
  status: string,
  user_id: string,
};

export type ModelListConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  image?: ModelStringInput | null,
  status?: ModelStringInput | null,
  user_id?: ModelIDInput | null,
  and?: Array< ModelListConditionInput | null > | null,
  or?: Array< ModelListConditionInput | null > | null,
  not?: ModelListConditionInput | null,
};

export type UpdateListInput = {
  id: string,
  title?: string | null,
  description?: string | null,
  image?: string | null,
  status?: string | null,
  user_id?: string | null,
};

export type DeleteListInput = {
  id: string,
};

export type CreateListItemInput = {
  id?: string | null,
  title: string,
  description: string,
  hyperlink: string,
  rating?: number | null,
  image?: string | null,
  list_id: string,
};

export type ModelListItemConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  hyperlink?: ModelStringInput | null,
  rating?: ModelIntInput | null,
  image?: ModelStringInput | null,
  list_id?: ModelIDInput | null,
  and?: Array< ModelListItemConditionInput | null > | null,
  or?: Array< ModelListItemConditionInput | null > | null,
  not?: ModelListItemConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateListItemInput = {
  id: string,
  title?: string | null,
  description?: string | null,
  hyperlink?: string | null,
  rating?: number | null,
  image?: string | null,
  list_id?: string | null,
};

export type DeleteListItemInput = {
  id: string,
};

export type ModelFollowFilterInput = {
  id?: ModelIDInput | null,
  following_id?: ModelIDInput | null,
  followed_id?: ModelIDInput | null,
  status?: ModelFollowStatusInput | null,
  and?: Array< ModelFollowFilterInput | null > | null,
  or?: Array< ModelFollowFilterInput | null > | null,
  not?: ModelFollowFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelFollowConnection = {
  __typename: "ModelFollowConnection",
  items:  Array<Follow | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  profile_photo?: ModelStringInput | null,
  privacy_status?: ModelPrivacyInput | null,
  bio?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelListFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  image?: ModelStringInput | null,
  status?: ModelStringInput | null,
  user_id?: ModelIDInput | null,
  and?: Array< ModelListFilterInput | null > | null,
  or?: Array< ModelListFilterInput | null > | null,
  not?: ModelListFilterInput | null,
};

export type ModelListItemFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  hyperlink?: ModelStringInput | null,
  rating?: ModelIntInput | null,
  image?: ModelStringInput | null,
  list_id?: ModelIDInput | null,
  and?: Array< ModelListItemFilterInput | null > | null,
  or?: Array< ModelListItemFilterInput | null > | null,
  not?: ModelListItemFilterInput | null,
};

export type ModelSubscriptionFollowFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  followed_id?: ModelSubscriptionIDInput | null,
  status?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFollowFilterInput | null > | null,
  or?: Array< ModelSubscriptionFollowFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionUserFilterInput = {
  username?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  profile_photo?: ModelSubscriptionStringInput | null,
  privacy_status?: ModelSubscriptionStringInput | null,
  bio?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionListFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  image?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionListFilterInput | null > | null,
  or?: Array< ModelSubscriptionListFilterInput | null > | null,
};

export type ModelSubscriptionListItemFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  hyperlink?: ModelSubscriptionStringInput | null,
  rating?: ModelSubscriptionIntInput | null,
  image?: ModelSubscriptionStringInput | null,
  list_id?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionListItemFilterInput | null > | null,
  or?: Array< ModelSubscriptionListItemFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    username?: string | null,
    email?: string | null,
    profile_photo?: string | null,
    privacy_status: Privacy,
    bio?: string | null,
    lists?:  {
      __typename: "ModelListConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateFollowMutationVariables = {
  input: CreateFollowInput,
  condition?: ModelFollowConditionInput | null,
};

export type CreateFollowMutation = {
  createFollow?:  {
    __typename: "Follow",
    id: string,
    following_id: string,
    followed_id: string,
    status: FollowStatus,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFollowMutationVariables = {
  input: UpdateFollowInput,
  condition?: ModelFollowConditionInput | null,
};

export type UpdateFollowMutation = {
  updateFollow?:  {
    __typename: "Follow",
    id: string,
    following_id: string,
    followed_id: string,
    status: FollowStatus,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFollowMutationVariables = {
  input: DeleteFollowInput,
  condition?: ModelFollowConditionInput | null,
};

export type DeleteFollowMutation = {
  deleteFollow?:  {
    __typename: "Follow",
    id: string,
    following_id: string,
    followed_id: string,
    status: FollowStatus,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    username?: string | null,
    email?: string | null,
    profile_photo?: string | null,
    privacy_status: Privacy,
    bio?: string | null,
    lists?:  {
      __typename: "ModelListConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    username?: string | null,
    email?: string | null,
    profile_photo?: string | null,
    privacy_status: Privacy,
    bio?: string | null,
    lists?:  {
      __typename: "ModelListConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateListMutationVariables = {
  input: CreateListInput,
  condition?: ModelListConditionInput | null,
};

export type CreateListMutation = {
  createList?:  {
    __typename: "List",
    id: string,
    title: string,
    description: string,
    image?: string | null,
    status: string,
    user_id: string,
    items?:  {
      __typename: "ModelListItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateListMutationVariables = {
  input: UpdateListInput,
  condition?: ModelListConditionInput | null,
};

export type UpdateListMutation = {
  updateList?:  {
    __typename: "List",
    id: string,
    title: string,
    description: string,
    image?: string | null,
    status: string,
    user_id: string,
    items?:  {
      __typename: "ModelListItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteListMutationVariables = {
  input: DeleteListInput,
  condition?: ModelListConditionInput | null,
};

export type DeleteListMutation = {
  deleteList?:  {
    __typename: "List",
    id: string,
    title: string,
    description: string,
    image?: string | null,
    status: string,
    user_id: string,
    items?:  {
      __typename: "ModelListItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateListItemMutationVariables = {
  input: CreateListItemInput,
  condition?: ModelListItemConditionInput | null,
};

export type CreateListItemMutation = {
  createListItem?:  {
    __typename: "ListItem",
    id: string,
    title: string,
    description: string,
    hyperlink: string,
    rating?: number | null,
    image?: string | null,
    list_id: string,
    createdAt: string,
    updatedAt: string,
    user_id?: string | null,
  } | null,
};

export type UpdateListItemMutationVariables = {
  input: UpdateListItemInput,
  condition?: ModelListItemConditionInput | null,
};

export type UpdateListItemMutation = {
  updateListItem?:  {
    __typename: "ListItem",
    id: string,
    title: string,
    description: string,
    hyperlink: string,
    rating?: number | null,
    image?: string | null,
    list_id: string,
    createdAt: string,
    updatedAt: string,
    user_id?: string | null,
  } | null,
};

export type DeleteListItemMutationVariables = {
  input: DeleteListItemInput,
  condition?: ModelListItemConditionInput | null,
};

export type DeleteListItemMutation = {
  deleteListItem?:  {
    __typename: "ListItem",
    id: string,
    title: string,
    description: string,
    hyperlink: string,
    rating?: number | null,
    image?: string | null,
    list_id: string,
    createdAt: string,
    updatedAt: string,
    user_id?: string | null,
  } | null,
};

export type GetFollowQueryVariables = {
  id: string,
};

export type GetFollowQuery = {
  getFollow?:  {
    __typename: "Follow",
    id: string,
    following_id: string,
    followed_id: string,
    status: FollowStatus,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFollowsQueryVariables = {
  id?: string | null,
  filter?: ModelFollowFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListFollowsQuery = {
  listFollows?:  {
    __typename: "ModelFollowConnection",
    items:  Array< {
      __typename: "Follow",
      id: string,
      following_id: string,
      followed_id: string,
      status: FollowStatus,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FollowsByFollowing_idQueryVariables = {
  following_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFollowFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FollowsByFollowing_idQuery = {
  followsByFollowing_id?:  {
    __typename: "ModelFollowConnection",
    items:  Array< {
      __typename: "Follow",
      id: string,
      following_id: string,
      followed_id: string,
      status: FollowStatus,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FollowsByFollowed_idQueryVariables = {
  followed_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFollowFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FollowsByFollowed_idQuery = {
  followsByFollowed_id?:  {
    __typename: "ModelFollowConnection",
    items:  Array< {
      __typename: "Follow",
      id: string,
      following_id: string,
      followed_id: string,
      status: FollowStatus,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FollowsByStatusQueryVariables = {
  status: FollowStatus,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFollowFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FollowsByStatusQuery = {
  followsByStatus?:  {
    __typename: "ModelFollowConnection",
    items:  Array< {
      __typename: "Follow",
      id: string,
      following_id: string,
      followed_id: string,
      status: FollowStatus,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    username?: string | null,
    email?: string | null,
    profile_photo?: string | null,
    privacy_status: Privacy,
    bio?: string | null,
    lists?:  {
      __typename: "ModelListConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  id?: string | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      username?: string | null,
      email?: string | null,
      profile_photo?: string | null,
      privacy_status: Privacy,
      bio?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByUsernameQueryVariables = {
  username: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByUsernameQuery = {
  usersByUsername?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      username?: string | null,
      email?: string | null,
      profile_photo?: string | null,
      privacy_status: Privacy,
      bio?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByEmailQueryVariables = {
  email: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByEmailQuery = {
  usersByEmail?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      username?: string | null,
      email?: string | null,
      profile_photo?: string | null,
      privacy_status: Privacy,
      bio?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetListQueryVariables = {
  id: string,
};

export type GetListQuery = {
  getList?:  {
    __typename: "List",
    id: string,
    title: string,
    description: string,
    image?: string | null,
    status: string,
    user_id: string,
    items?:  {
      __typename: "ModelListItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListListsQueryVariables = {
  id?: string | null,
  filter?: ModelListFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListListsQuery = {
  listLists?:  {
    __typename: "ModelListConnection",
    items:  Array< {
      __typename: "List",
      id: string,
      title: string,
      description: string,
      image?: string | null,
      status: string,
      user_id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListsByUser_idQueryVariables = {
  user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelListFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListsByUser_idQuery = {
  listsByUser_id?:  {
    __typename: "ModelListConnection",
    items:  Array< {
      __typename: "List",
      id: string,
      title: string,
      description: string,
      image?: string | null,
      status: string,
      user_id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetListItemQueryVariables = {
  id: string,
};

export type GetListItemQuery = {
  getListItem?:  {
    __typename: "ListItem",
    id: string,
    title: string,
    description: string,
    hyperlink: string,
    rating?: number | null,
    image?: string | null,
    list_id: string,
    createdAt: string,
    updatedAt: string,
    user_id?: string | null,
  } | null,
};

export type ListListItemsQueryVariables = {
  filter?: ModelListItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListListItemsQuery = {
  listListItems?:  {
    __typename: "ModelListItemConnection",
    items:  Array< {
      __typename: "ListItem",
      id: string,
      title: string,
      description: string,
      hyperlink: string,
      rating?: number | null,
      image?: string | null,
      list_id: string,
      createdAt: string,
      updatedAt: string,
      user_id?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListItemsByList_idQueryVariables = {
  list_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelListItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListItemsByList_idQuery = {
  listItemsByList_id?:  {
    __typename: "ModelListItemConnection",
    items:  Array< {
      __typename: "ListItem",
      id: string,
      title: string,
      description: string,
      hyperlink: string,
      rating?: number | null,
      image?: string | null,
      list_id: string,
      createdAt: string,
      updatedAt: string,
      user_id?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateFollowSubscriptionVariables = {
  filter?: ModelSubscriptionFollowFilterInput | null,
  following_id?: string | null,
};

export type OnCreateFollowSubscription = {
  onCreateFollow?:  {
    __typename: "Follow",
    id: string,
    following_id: string,
    followed_id: string,
    status: FollowStatus,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFollowSubscriptionVariables = {
  filter?: ModelSubscriptionFollowFilterInput | null,
  following_id?: string | null,
};

export type OnUpdateFollowSubscription = {
  onUpdateFollow?:  {
    __typename: "Follow",
    id: string,
    following_id: string,
    followed_id: string,
    status: FollowStatus,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFollowSubscriptionVariables = {
  filter?: ModelSubscriptionFollowFilterInput | null,
  following_id?: string | null,
};

export type OnDeleteFollowSubscription = {
  onDeleteFollow?:  {
    __typename: "Follow",
    id: string,
    following_id: string,
    followed_id: string,
    status: FollowStatus,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  id?: string | null,
  owner?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    username?: string | null,
    email?: string | null,
    profile_photo?: string | null,
    privacy_status: Privacy,
    bio?: string | null,
    lists?:  {
      __typename: "ModelListConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  id?: string | null,
  owner?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    username?: string | null,
    email?: string | null,
    profile_photo?: string | null,
    privacy_status: Privacy,
    bio?: string | null,
    lists?:  {
      __typename: "ModelListConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  id?: string | null,
  owner?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    username?: string | null,
    email?: string | null,
    profile_photo?: string | null,
    privacy_status: Privacy,
    bio?: string | null,
    lists?:  {
      __typename: "ModelListConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateListSubscriptionVariables = {
  filter?: ModelSubscriptionListFilterInput | null,
  user_id?: string | null,
};

export type OnCreateListSubscription = {
  onCreateList?:  {
    __typename: "List",
    id: string,
    title: string,
    description: string,
    image?: string | null,
    status: string,
    user_id: string,
    items?:  {
      __typename: "ModelListItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateListSubscriptionVariables = {
  filter?: ModelSubscriptionListFilterInput | null,
  user_id?: string | null,
};

export type OnUpdateListSubscription = {
  onUpdateList?:  {
    __typename: "List",
    id: string,
    title: string,
    description: string,
    image?: string | null,
    status: string,
    user_id: string,
    items?:  {
      __typename: "ModelListItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteListSubscriptionVariables = {
  filter?: ModelSubscriptionListFilterInput | null,
  user_id?: string | null,
};

export type OnDeleteListSubscription = {
  onDeleteList?:  {
    __typename: "List",
    id: string,
    title: string,
    description: string,
    image?: string | null,
    status: string,
    user_id: string,
    items?:  {
      __typename: "ModelListItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateListItemSubscriptionVariables = {
  filter?: ModelSubscriptionListItemFilterInput | null,
  user_id?: string | null,
};

export type OnCreateListItemSubscription = {
  onCreateListItem?:  {
    __typename: "ListItem",
    id: string,
    title: string,
    description: string,
    hyperlink: string,
    rating?: number | null,
    image?: string | null,
    list_id: string,
    createdAt: string,
    updatedAt: string,
    user_id?: string | null,
  } | null,
};

export type OnUpdateListItemSubscriptionVariables = {
  filter?: ModelSubscriptionListItemFilterInput | null,
  user_id?: string | null,
};

export type OnUpdateListItemSubscription = {
  onUpdateListItem?:  {
    __typename: "ListItem",
    id: string,
    title: string,
    description: string,
    hyperlink: string,
    rating?: number | null,
    image?: string | null,
    list_id: string,
    createdAt: string,
    updatedAt: string,
    user_id?: string | null,
  } | null,
};

export type OnDeleteListItemSubscriptionVariables = {
  filter?: ModelSubscriptionListItemFilterInput | null,
  user_id?: string | null,
};

export type OnDeleteListItemSubscription = {
  onDeleteListItem?:  {
    __typename: "ListItem",
    id: string,
    title: string,
    description: string,
    hyperlink: string,
    rating?: number | null,
    image?: string | null,
    list_id: string,
    createdAt: string,
    updatedAt: string,
    user_id?: string | null,
  } | null,
};
