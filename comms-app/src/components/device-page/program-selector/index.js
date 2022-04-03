import React, { useContext } from "react";
import { AppStateContext } from "../../../app-state/context";

export default function ProgramSelector({pageIndex}) {
    const {programLists, selectedPrograms, updateSelectedProgram} = useContext(AppStateContext);

    const programIndex = selectedPrograms?.[pageIndex] ?? 0;
    const programList = programLists?.[pageIndex];
    return programList !== undefined ? (
        <select
            value={programIndex}
            onChange={event => {
                const newProgramIndex = event.target.value;
                updateSelectedProgram(pageIndex, newProgramIndex);
            }}
        >
            {programList.map((program, index) => 
                <option key={`${program.name}-${index}`} value={index}>{program.name}</option>
            )}
        </select>
    ) : (
        <p>Loading Programs...</p>
    );
}