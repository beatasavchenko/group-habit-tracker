import { generateOtp, validateEmails } from "~/lib/utils";
import { sendVerificationEmail } from "./emailService";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  getUsersByUsernameOrEmail,
  updateUser,
} from "./userService";
import {
  DB_GroupType_Zod,
  Partial_DB_GroupType_Zod,
  type GroupMember,
} from "~/lib/types";
import dayjs from "dayjs";
import {
  adjectives,
  animals,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
import z from "zod";
import {
  groupMembers,
  groups,
  users,
  type DB_GroupMemberType,
  type DB_GroupType,
  type DB_UserType,
} from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function findGroupById(id: number) {
  const group = await db
    .selectDistinct()
    .from(groups)
    .leftJoin(groupMembers, eq(groupMembers.groupId, groups.id))
    .where(eq(groups.id, id));

  return group[0] ?? null;
}

export async function findGroupByUsername(username: string) {
  const groupId = await db
    .selectDistinct()
    .from(groups)
    .where(eq(groups.groupUsername, username));

  const rows = await db
    .select({
      group: groups,
      member: groupMembers,
      user: users,
    })
    .from(groups)
    .leftJoin(groupMembers, eq(groupMembers.groupId, groups.id))
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groups.groupUsername, username));

  const result = (await rows).reduce<
    Record<number, { group: DB_GroupType; groupMembers: GroupMember[] }>
  >((acc, row) => {
    const group = row.group;
    const groupMember = row.member;
    const user = row.user;
    if (!acc[group.id]) {
      acc[group.id] = { group, groupMembers: [] };
    }
    if (groupMember) {
      acc[group.id]?.groupMembers.push({
        ...groupMember,
        username: user.username,
        image: user.image,
        email: user.email,
        name: user.name,
      });
    }
    return acc;
  }, {});

  return groupId[0]?.id ? result[groupId[0]?.id] : null;
}

export async function createGroup(groupToCreate: {
  name: string;
  userId: number;
  friends: string[];
}) {
  const { name, friends } = groupToCreate;

  if (!name) {
    return null;
  }
  const numberDictionary = NumberDictionary.generate({
    min: 10000,
    max: 99999,
  });
  const groupUsername = uniqueNamesGenerator({
    dictionaries: [[name.replace(/\s/g, "")], numberDictionary],
    separator: "",
    style: "lowerCase",
    length: 2,
  });

  const group = await db
    .insert(groups)
    .values({
      ...groupToCreate,
      name,
      groupUsername,
    })
    .$returningId();

  friends.forEach(async (friend) => {
    const user = await findUserByUsername(friend);
    if (!user) return;
    await db
      .insert(groupMembers)
      .values({
        groupId: group[0]?.id,
        userId: user.id,
        role: user.id === groupToCreate.userId ? "owner" : "member",
      })
      .$returningId();
  });

  if (!group[0]) return null;
  return await findGroupById(group[0]?.id);
}

export async function getGroupsForUser(userId: number) {
  const groupsForUser = await db
    .select()
    .from(groups)
    .leftJoin(groupMembers, eq(groupMembers.groupId, groups.id))
    .leftJoin(users, eq(groupMembers.userId, users.id))
    .where(eq(users.id, userId))
    .orderBy(groups.id);

  return groupsForUser.map((group) => ({
    id: group.groups.id,
    name: group.groups.name,
    groupUsername: group.groups.groupUsername,
    image: group.groups.image,
    members: group.group_members
      ? [
          {
            id: group.group_members.userId,
            name: group.users?.name,
            email: group.users?.email,
            role: group.group_members.role,
            isVerified: group.users?.isVerified,
          },
        ]
      : [],
  }));
}

export async function updateGroup(
  id: number,
  data: Partial<{
    name: string;
    groupUsername: string;
    image: string | null;
  }>,
) {
  const group = await db
    .update(groups)
    .set(data)
    .where(eq(groups.id, id))
    .$dynamic();

  if (!group[0]) return null;
  return await findGroupById(group[0]?.insertId);
}

export async function addGroupMembers(
  userId: number,
  groupId: number,
  groupUsername: string,
  members: { usernameOrEmail: string; role: "admin" | "member" }[],
) {
  const emails = await validateEmails(members.map((m) => m.usernameOrEmail));
  const membersToCreateByEmails = members.filter((m) =>
    emails.includes(m.usernameOrEmail),
  );
  const usernames = members.filter((m) => !emails.includes(m.usernameOrEmail));

  const membersToCreate: (DB_UserType & { role: "admin" | "member" })[] = [];
  for (const obj of usernames) {
    const user = await findUserByUsername(obj.usernameOrEmail);
    if (user) {
      membersToCreate.push({ ...user, role: obj.role });
    }
  }

  for (const member of membersToCreate) {
    await db
      .insert(groupMembers)
      .values({
        groupId: groupId,
        userId: member.id,
        role: member.role,
      })
      .$returningId();
  }

  return await findGroupByUsername(groupUsername);
}
