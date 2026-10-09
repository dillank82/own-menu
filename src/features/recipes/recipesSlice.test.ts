import { RootState } from "@/store/store"
import { Recipe } from "@/types"
import reducer, { addRecipe, archiveRecipe, restoreRecipe, selectRecipes } from "./recipesSlice"

const recipeData: Omit<Recipe, 'id' | 'createdAt' | 'archived'> = {
    title: 'Bacon and eggs',
    category: 'breakfast',
    ingredients: ['bacon', 'eggs', 'salt'],
    steps: [{ id: 1, text: 'fry the bacon' }, { id: 2, text: 'fry the eggs' }]
}

describe('recipesSlice', () => {
    it('adds recipe with id, createdAt and archived: false', () => {
        const state = reducer(undefined, addRecipe(recipeData))
        const [recipe] = Object.values(state.entities)

        expect(recipe).toMatchObject({ ...recipeData, archived: false })
        expect(recipe.id).toEqual(expect.any(String))
        expect(recipe.createdAt).toEqual(expect.any(Number))
    })
    it('archives and restores recipe without side changes', () => {
        const state = reducer(undefined, addRecipe(recipeData))
        const id = state.ids[0]

        const archived = reducer(state, archiveRecipe(id))
        expect(archived.entities[id].archived).toBe(true)
        expect(archived.entities[id]).toMatchObject(recipeData)

        const restored = reducer(archived, restoreRecipe(id))
        expect(restored.entities[id].archived).toBe(false)
        expect(restored.entities[id]).toMatchObject(recipeData)
    })
})

describe('selectRecipes', () => {
    let state = reducer(undefined, addRecipe(recipeData))
    state = reducer(state, addRecipe({ ...recipeData, category: 'dessert' }))
    const archivedId = state.ids[0] as string
    state = reducer(state, archiveRecipe(archivedId))

    const root = { recipes: state } as RootState

    expect(selectRecipes(root, 'breakfast', true)).toHaveLength(1)
    expect(selectRecipes(root, 'breakfast', false)).toHaveLength(0)
    expect(selectRecipes(root, 'dessert', false)).toHaveLength(1)
})