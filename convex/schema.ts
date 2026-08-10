import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  metrics: defineTable({
    clientId: v.id("users"),
    sprintNumber: v.number(),

    codeQuality: v.number(),
    velocity: v.number(),
    iterationQuality: v.number(),
    communication: v.number(),

    notes: v.optional(v.string()),

    recordedAt: v.number(),
    recordedBy: v.id("users"),
  })
    .index("by_client", ["clientId"])
    .index("by_sprint", ["sprintNumber"]),

  users: defineTable({
    workosUserId: v.string(),
    email: v.string(),
    name: v.string(),

    role: v.union(
      v.literal("admin"),
      v.literal("client"),
      v.literal("senior")
    ),

    avatarUrl: v.optional(v.string()),
    track: v.optional(v.string()),
    domain: v.optional(v.string()),
    tier: v.optional(v.string()),
    cohort: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    status: v.optional(v.string()),
    assignedSeniorId: v.optional(v.id("users")),
    timezone: v.optional(v.string()),
  }),

  // Module 3 - Events
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),

    type: v.union(
      v.literal("standup"),
      v.literal("senior_session"),
      v.literal("sprint_planning"),
      v.literal("sprint_retro"),
      v.literal("interview"),
      v.literal("mentorship_1on1"),
      v.literal("code_review"),
      v.literal("custom")
    ),

    startTime: v.number(),
    endTime: v.number(),

    attendeeIds: v.array(v.id("users")),

    timezone: v.string(),

    location: v.optional(v.string()),
  }),
});