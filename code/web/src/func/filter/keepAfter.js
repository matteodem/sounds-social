const reduceItemsAfterCompare = compare => (accumulatedItems, item) => {
  if (accumulatedItems.keep) {
    return {
      ...accumulatedItems,
      items: [...accumulatedItems.items, item]
    }
  }

  const keepItems = compare(item)

  if (keepItems) {
    return {
      keep: true,
      items: [item]
    }
  }

  return accumulatedItems
}

export const keepAfter = compare => items =>
  items.reduce(reduceItemsAfterCompare(compare), { items: [] }).items
