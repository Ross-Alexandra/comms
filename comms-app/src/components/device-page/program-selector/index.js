import React, { useState, useContext } from "react";
import { AppStateContext } from "../../../app-state/context";

export default function ProgramSelector({pageIndex}) {
    const {programLists, selectedPrograms, updateSelectedProgram} = useContext(AppStateContext);
    const [programIndex, setProgramIndex] = useState(selectedPrograms?.[pageIndex] ?? 0);

    const programList = programLists[pageIndex];
    return programList !== undefined ? (
        <select
            value={programIndex}
            onChange={event => {
                const newProgramIndex = event.target.value;
                setProgramIndex(newProgramIndex);
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