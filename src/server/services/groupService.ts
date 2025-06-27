import { generateOtp } from "~/lib/utils";
import { sendVerificationEmail } from "./emailService";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  updateUser,
} from "./userService";
import { DB_GroupType_Zod } from "~/lib/types";
import dayjs from "dayjs";
import {
  adjectives,
  animals,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
import z from "zod";
import { groupMembers, groups, users } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function getGroupById(id: number) {
  const group = await db
    .selectDistinct()
    .from(groups)
    .leftJoin(groupMembers, eq(groupMembers.groupId, groups.id))
    .where(eq(groups.id, id));

  return group[0] ?? null;
}

export async function getGroupByUsername(username: string) {
  const group = await db
    .selectDistinct()
    .from(groups)
    .leftJoin(groupMembers, eq(groupMembers.groupId, groups.id))
    .where(eq(groups.groupUsername, username));

  return group[0] ?? null;
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
  return await getGroupById(group[0]?.id);
}

export async function getGroupsForUser(userId: number) {
  const groupsForUser = await db
    .select()
    .from(groups)
    .leftJoin(groupMembers, eq(groupMembers.groupId, groups.id))
    .leftJoin(users, eq(groupMembers.userId, users.id))
    .orderBy(groups.id);

  return groupsForUser.map((group) => ({
    id: group.groups.id,
    name: group.groups.name,
    groupUsername: group.groups.groupUsername,
    image: group.groups.image,
    members: group.groupMembers
      ? [
          {
            id: group.groupMembers.userId,
            name: group.users?.name,
            email: group.users?.email,
            role: group.groupMembers.role,
            isVerified: group.users?.isVerified,
          },
        ]
      : [],
  }));
}
