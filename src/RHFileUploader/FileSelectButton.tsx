import { CSSProperties, FC, PropsWithChildren } from "react"

const buttonStyle: CSSProperties = {
    borderRadius: 8,
    border: '1px solid transparent',
    padding: '0.6em 1.2em',
    fontSize: '1em',
    fontWeight: 500,
    backgroundColor: '#1a1a1a',
    transition: 'border-color 0.25s'
  }

const FileSelectButton: FC<PropsWithChildren<{htmlFor: string}>> = ({ children, htmlFor }) => {
return <label htmlFor={htmlFor} style={buttonStyle}>{children}</label>
}

export default FileSelectButton