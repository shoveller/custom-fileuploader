import './App.css'
import { Select, Tag } from "antd";
import { useForm, Controller, FormProvider, FieldValues } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { ChangeEventHandler, CSSProperties, FC, MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import { uniqBy } from 'lodash-es'
import { useId } from 'react'

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

const makeFileID = (file: File) => `${file.name}_${file.lastModified}`

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

const FileSelect: FC<{field: FieldValues}> = ({ field }) => {
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

const createDataTransfer = (fileList: FileList) => {
  const dataTransfer = new DataTransfer()
  Array.from(fileList).forEach(file => dataTransfer.items.add(file));

  return dataTransfer
}

const useOnFileChange = (field: FieldValues) => {
  const prevFileList = (field.value || new DataTransfer().files) as FileList
  const prevFileDatas = Array.from(prevFileList).map((file) => {
    return {
      id: makeFileID(file),
      file
    }
  })
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newFileList = e.currentTarget.files || new DataTransfer().files;
    const newFileDatas = Array.from(newFileList).map((file) => {
      return {
        id: makeFileID(file),
        file
      }
    })
    const fileDatas = uniqBy([...prevFileDatas, ...newFileDatas], 'id');

    const maxFiles = 5;
    if (fileDatas.length > maxFiles) {
      alert(`최대 ${maxFiles}개의 파일만 첨부할 수 있습니다.`)
      return
    }

    const files = fileDatas.map(data => data.file)
    field.onChange(files);
    
    e.target.value = '';
  }
  

  return onChange
}

const FielInput: FC<{field: FieldValues, id: string}> = ({ field, id }) => {
  const onChange = useOnFileChange(field)

  return (
    <input 
        style={{ display: 'none' }} 
        type="file" 
        id={id} 
        name={field.name}
        onBlur={field.onBlur} 
        ref={field.ref} 
        multiple={true} 
        onChange={onChange}  
    />
  )
}

const RHFileUploader: FC<{ name: string, id: string }> = ({ name, id }) => {
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

function App() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log, console.log)}>
      <RHFileUploader id="hello" name="test" />
        <div>
          <button type="submit">서브밋</button>
          <button type="button" onClick={() => methods.reset({
            test: new DataTransfer().files
          })}>리셋</button>
        </div>
      </form>
      <DevTool control={methods.control} />
    </FormProvider>
  );

}

export default App
