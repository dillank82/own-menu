// Assumes unique items: with duplicates, a value equal to `last` can still be returned.
export function pickRandom<T>(items: readonly T[], last?: T): T | undefined {
    if (items.length === 0) return undefined
    if (items.length === 1) return items[0]

    const lastIndex = last === undefined ? -1 : items.indexOf(last)
    if (lastIndex === -1) {
        return items[Math.floor(Math.random() * items.length)]
    }

    let i = Math.floor(Math.random() * (items.length - 1))
    if (i >= lastIndex) i++
    return items[i]
}