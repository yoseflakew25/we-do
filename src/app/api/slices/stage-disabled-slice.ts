import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StageState {
    isStageDisabled: boolean;
}

const initialState: StageState = {
    isStageDisabled : false
}

const stageSlice = createSlice({
    name: 'stage',
    initialState,
    reducers: {
        setStageDisable: (state, action:PayloadAction<boolean>) => {
            state.isStageDisabled = action.payload
        }
    }
})

export const {setStageDisable} = stageSlice.actions;

export default stageSlice.reducer

