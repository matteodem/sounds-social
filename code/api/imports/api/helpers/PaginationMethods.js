import { getOr } from 'lodash/fp'
import { check } from 'meteor/check'

export const makePaginatableResolver = ({ resolver, defaultLimit }) => {
  return (root, args, ...restArgs) => {
    if (!args.limit) args.limit = getOr(defaultLimit)('pagination.limit')(args)
    if (!args.skip) args.skip = getOr(0)('pagination.skip')(args)

    const resolved = resolver(root, args, ...restArgs)

    check(resolved, {
      items: Array,
      totalCount: Number,
    })

    const { items, totalCount } = resolved

    return {
      items,
      paginationInfo: {
        totalCount,
        hasMore: items.length + args.skip < totalCount,
        // used in resolver
        limit: args.limit,
        skip: args.skip,
      },
    }
  }
}

export const addPaginationTypeDef = type => `
type Paginatable${type}Result {
  items: [${type}]
  paginationInfo: PaginationInfo
}
`

export const resolveFindQuery = ({ limit, skip }) => findMethod => {
  return {
    totalCount: findMethod().count(),
    items: findMethod({ limit, skip }).fetch(),
  }
}
