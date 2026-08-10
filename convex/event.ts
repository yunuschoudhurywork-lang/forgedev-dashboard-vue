
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//createEvent()
export const createEvent = mutation({
  args: {
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
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args);
  },
});

//getEvents()
export const getEvents = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

//getEventById()
export const getEventById = query({
  args: {
    id: v.id("events"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

//updateEvent()
export const updateEvent = mutation({
  args: {
    id: v.id("events"),

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
  },

  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, updates);

    return id;
  },
});

//deleteEvent()
export const deleteEvent = mutation({
  args: {
    id: v.id("events"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);

    return args.id;
  },
});
