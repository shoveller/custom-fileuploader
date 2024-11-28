import { Select, Tag } from "antd";
import { useForm, Controller, FormProvider, FieldValues, useFormContext } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { ChangeEventHandler, FC, MouseEventHandler, PropsWithChildren, ReactNode } from "react";

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

  return (
    <Tag
      onMouseDown={onMouseDown}
      closable={true}
      onClose={() =>onClose(value)}
    >
      {label}
    </Tag>
  );
};

const FileSelectButton: FC<PropsWithChildren<{htmlFor: string}>> = ({ children, htmlFor }) => {
  return <label htmlFor={htmlFor}>{children}</label>
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
        style={{ width: '360px', height: '32px' }} 
        onBlur={field.onBlur} 
        value={options} 
        options={options} 
        mode="multiple" 
        placeholder="선택하시요"
        maxTagCount={2}
        maxTagTextLength={10}
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

const FielInput: FC<{field: FieldValues, id: string}> = ({ field, id }) => {
  
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const dataTransfer = createDataTransfer(e.currentTarget.files || new DataTransfer().files)
    field.onChange(dataTransfer.files);
  }

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
        <button type="submit">서브밋</button>
        <button type="reset">리셋</button>
      </form>
      <DevTool control={methods.control} />
    </FormProvider>
  );

}

export default App
