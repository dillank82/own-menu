import { pickRandom } from "./utils"

afterEach(() => jest.restoreAllMocks())

describe('pickRandom', () => {
    it('returns undefined for an empty list', () => {
        expect(pickRandom([])).toBeUndefined()
    })

    it('returns the only item even when it is the last one', () => {
        expect(pickRandom(['a'], 'a')).toBe('a')
    })

    it('skips the last item when the random index lands on it', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.5) // i = 1, last = 'b'
        expect(pickRandom(['a', 'b', 'c'], 'b')).toBe('c')
    })

    it('keeps the index when it is before the last item', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0) // i = 0, last = 'b'
        expect(pickRandom(['a', 'b', 'c'], 'b')).toBe('a')
    })

    it('never returns the last item, wherever it sits in the list', () => {
        for (const last of ['a', 'b', 'c']) {
            for (const r of [0, 0.5, 0.999]) {
                jest.spyOn(Math, 'random').mockReturnValue(r)
                const result = pickRandom(['a', 'b', 'c'], last)
                expect(result).not.toBe(last)
                expect(['a', 'b', 'c']).toContain(result)
            }
        }
    })

    it('picks from the whole list when last is not in it', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.999)
        expect(pickRandom(['a', 'b', 'c'], 'x')).toBe('c')
    })
})