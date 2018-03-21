export const isCreatorResolver = (root, args, context) =>
  root.creatorId === context.userId
