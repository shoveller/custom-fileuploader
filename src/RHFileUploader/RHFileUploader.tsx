import { FC } from "react"
import { Controller } from "react-hook-form"
import FileSelect from "./FileSelect"
import FileSelectButton from "./FileSelectButton"
import FielInput from "./FielInput"
import RHFileUploaderContextProvider, { RHFileUploaderContextProps } from "./RHFileUploaderContext"

const RHFileUploader: FC<RHFileUploaderContextProps> = (props) => {
    return (
        <Controller name={props.name} render={({ field }) => {
            return (
                <RHFileUploaderContextProvider value={props} >
                    <FileSelect field={field} />
                    <FileSelectButton htmlFor={props.id}>
                    파일 선택
                    </FileSelectButton>
                    <FielInput id={props.id} field={field} />
                </RHFileUploaderContextProvider>
            )}} 
        />
    )
}

export default RHFileUploader