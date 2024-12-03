import { Select, Tag } from "antd"
import { FC, MouseEventHandler, ReactNode, useId } from "react";
import { FieldValues } from "react-hook-form"
import makeFileID from "./makeFileID";

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

type FileTagProps = {
    label: ReactNode;
    value: string;
    disabled: boolean;
    onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    closable: boolean;
    isMaxTag: boolean;
};

const tagRender = ({ onClose }:{onClose: (value: string) => void}) => ({ label, value }: FileTagProps) => {
    const onMouseDown: MouseEventHandler<HTMLSpanElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const id = useId()
    const key = `${value}_${id}`
  
    return (
      <Tag
        key={key}
        onMouseDown={onMouseDown}
        closable
        onClose={() =>onClose(value)}
      >
        {label}
      </Tag>
    );
  };

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
        tagRender={tagRender({ onClose: onRemove })}
        onDeselect={(value) => onRemove(value as unknown as string)}
        />
    )
  }

  export default FileSelect

