import { createContext, FC, PropsWithChildren } from "react";

export type RHFileUploaderContextProps = { name: string, id: string, maxFiles?: number }

const RHFileUploaderContext = createContext<RHFileUploaderContextProps | null>(null)

const RHFileUploaderContextProvider: FC<PropsWithChildren<{ value: RHFileUploaderContextProps }>> = ({ children, value }) => {
    return (
        <RHFileUploaderContext.Provider value={value}>{children}</RHFileUploaderContext.Provider>
    )
}

export default RHFileUploaderContextProvider