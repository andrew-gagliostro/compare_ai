/* eslint-disable no-shadow */
import mongoose from "mongoose";

export enum Permission {
  // ADMIN - ui-related permissions
  ACCESS_ADMIN = "access_admin", // this permission being attached to a role will allow the user to perform all operations on all assets in the platform
  IMPORT_USER = "import_user",
  CRUD_GROUP = "crud_group",
  CRUD_ROLE = "crud_role",
  CRUD_USER = "crud_user", // for updating user role/group membership
  CRUD_PORTFOLIO = "crud_portfolio",
  CRUD_APPLICATION = "crud_application",
  CRUD_PRACTICE = "crud_practice",
  CRUD_CARD = "crud_card",
  CRUD_CARD_DECK = "crud_card_deck",
  CRUD_DOCUMENTATION = "crud_documentation",
  CRUD_INTEGRATION = "crud_integration",
  CRUD_CONNECTION = "crud_connection",
  // TEAM_LEAD
  CRUD_POLL = "crud_poll",
  CRUD_TARGET = "crud_target",
  REFRESH_DASHBOARD = "refresh_dashboard",
  // TEAM_MEMBER
  READ_PORTFOLIO = "read_portfolio",
  READ_APPLICATION = "read_application",
  VIEW_AI_CHAT = "view_coruscant_ai_chat_team",
}

export interface RoleModel {
  _id?: string;
  name: string;
  permissions: string[];
}

const roleSchema = new mongoose.Schema<RoleModel>({
  name: {
    type: String,
    required: [true, "Please provide a name."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  permissions: {
    type: [String],
  },
});

export const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export interface GroupModel {
  _id?: string;
  name: string;
  roles: string[];
}

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

export const Group =
  mongoose.models.Group || mongoose.model("Group", groupSchema);

export interface GroupUserModel {
  _id?: string;
  group_id: string;
  user_id: string;
}

const groupUserSchema = new mongoose.Schema<GroupUserModel>({
  group_id: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: String,
    required: true,
    index: true,
  },
});

export const GroupUser =
  mongoose.models.GroupUser || mongoose.model("GroupUser", groupUserSchema);

export interface UserModel {
  _id?: string;
  name?: string;
  email: string;
  picture?: string;
  settings?: Map<string, string>;
  roles: string[];
  favorite_application?: string;
  __v?: number;
}

const schema = new mongoose.Schema<UserModel>({
  name: {
    type: String,
    required: false,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: false,
    default: "",
  },
  picture: {
    type: String,
    required: false,
    default: "",
  },
  settings: {
    type: Map,
    of: String,
    default: new Map<string, string>(),
  },
  roles: {
    type: [String],
    ref: "Role",
    default: [],
  },
  favorite_application: {
    type: String,
    ref: "Application",
    default: null,
  },
});

export default (mongoose.models.User as mongoose.Model<UserModel>) ||
  mongoose.model("User", schema);
