import { RootState } from '@/store/store'
import {
    createEntityAdapter,
    createSelector,
    createSlice,
    nanoid,
    type PayloadAction
} from '@reduxjs/toolkit'
import type { Category, Recipe } from '../../types'

const adapter = createEntityAdapter<Recipe>({
    sortComparer: (a, b) => a.createdAt - b.createdAt,
})

const recipesSlice = createSlice({
    name: 'recipes',
    initialState: adapter.getInitialState(),
    reducers: {
        addRecipe: {
            reducer: adapter.addOne,
            prepare: (data: Omit<Recipe, 'id' | 'createdAt' | 'archived'>) => ({
                payload: { ...data, id: nanoid(), createdAt: Date.now(), archived: false },
            }),
        },
        updateRecipe: adapter.updateOne,
        removeRecipe: adapter.removeOne,
        archiveRecipe(state, action: PayloadAction<string>) {
            adapter.updateOne(state, { id: action.payload, changes: { archived: true } })
        },
        restoreRecipe(state, action: PayloadAction<string>) {
            adapter.updateOne(state, { id: action.payload, changes: { archived: false } })
        }
    }
})

export const { addRecipe, updateRecipe, removeRecipe, archiveRecipe, restoreRecipe } = recipesSlice.actions
export default recipesSlice.reducer

const { selectAll, selectById } = adapter.getSelectors<RootState>((s) => s.recipes)
export { selectById as selectRecipeById }

export const selectRecipes = createSelector(
    [
        selectAll,
        (_: RootState, category: Category) => category,
        (_: RootState, __: Category, archived: boolean) => archived,
    ],
    (all, category, archived) =>
        all.filter((r) => r.category === category && r.archived === archived)
)