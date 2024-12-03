import { FC } from "react"
import { Controller } from "react-hook-form"
import FileSelect from "./FileSelect"
import FileSelectButton from "./FileSelectButton"
import FielInput from "./FielInput"

type RHFileUploaderProps = { name: string, id: string, maxFiles?: number }

const RHFileUploader: FC<RHFileUploaderProps> = ({ name, id }) => {
    return (
        <Controller name={name} render={({ field }) => {
            return (
                <>
                    <FileSelect field={field} />
                    <FileSelectButton htmlFor={id}>
                    파일 선택
                    </FileSelectButton>
                    <FielInput id={id} field={field} />
                </>
            )}} 
        />
    )
}

export default RHFileUploader