import { Select } from "antd"
import { FC } from "react";
import { FieldValues } from "react-hook-form"
import makeFileID from "./makeFileID";
import FileTag from "./FileTag";

const makeFileOptions = (fileList: FileList = new DataTransfer().files) => {
    const dataTransfer = createDataTransfer(fileList)
    const files = Array.from(dataTransfer.files)
    
    return files.map(file => {
      return {
        label: file.name,
        value: makeFileID(file),
      }
    })
  }

const createDataTransfer = (fileList: FileList) => {
    const dataTransfer = new DataTransfer()
    Array.from(fileList).forEach(file => dataTransfer.items.add(file));
  
    return dataTransfer
  }

const useRemoveFile = (field: FieldValues) => {
    return (value: string) => {
      const dataTransfer = createDataTransfer(field.value)
      const files = Array.from(dataTransfer.files)
      const index = files.findIndex(file => makeFileID(file) === value)
      if (index < 0) {
        return;
      }
  
      dataTransfer.items.remove(index)
      field.onChange(dataTransfer.files)
    }
  }

type FileSelectProps = {field: FieldValues}

const FileSelect: FC<FileSelectProps> = ({ field }) => {
    const onRemove = useRemoveFile(field)
    const options = makeFileOptions(field.value)
    
    return (
      <Select
        open={false}
        suffixIcon={false}
        style={{ 
          width: '400px', 
          height: 'auto',
          background: 'transparent',  // Select 자체의 배경
        }} 
        className="transparent-select"
        onBlur={field.onBlur} 
        value={options} 
        options={options}
        mode="multiple" 
        placeholder="파일을 선택하여 첨부해 주세요"
        tagRender={({ value, label }) => {
            return (
                <FileTag onClose={() => onRemove(value)}>
                    {label}
                </FileTag>
            )
        }}
        onDeselect={(value) => onRemove(value as unknown as string)}
      />
    )
  }

  export default FileSelect

