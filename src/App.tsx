import { Select, Tag } from "antd";
import { useForm, Controller, FormProvider, FieldValues } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { ChangeEventHandler, CSSProperties, FC, MouseEventHandler, PropsWithChildren, ReactNode, useState } from "react";

type FileTagProps = {
  label: ReactNode;
  value: string;
  disabled: boolean;
  onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  closable: boolean;
  isMaxTag: boolean;
};

const tagRender = ({ onClose }:{onClose: (value: string) => void, onMaxTagClose: () => void}) => ({ label, value }: FileTagProps) => {
  const onMouseDown: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // if (isMaxTag) {
  //   return (
  //     <Tag
  //       onMouseDown={onMouseDown}
  //       onClick={onMaxTagClose}
  //     >
  //       더보기
  //     </Tag>
  //   );
  // }

  return (
    <Tag
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

const useDropDownOpen = () => {
  const [open, setOpen] = useState(false);
  const openDropdown = () => setOpen(true)

  return { open, setOpen, openDropdown }
}

const FileSelect: FC<{field: FieldValues}> = ({ field }) => {
  const onRemove = useRemoveFile(field)
  const options = makeFileOptions(field.value)
  const { open, setOpen, openDropdown } = useDropDownOpen()
  

  return (
    <Select
      open={open}
      onDropdownVisibleChange={setOpen}
      style={{ width: '400px', height: 'auto' }} 
      onBlur={field.onBlur} 
      value={options} 
      options={options}
      mode="multiple" 
      placeholder="파일을 선택하여 첨부해 주세요"
      // maxTagCount={2}
      // maxTagTextLength={10}
      tagRender={tagRender({ onClose: onRemove, onMaxTagClose: openDropdown })}
      // maxTagPlaceholder={(omittedValues) => {
      //   return <>+{omittedValues.length}개 더 있음</>
      // }}
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
    const files = e.currentTarget.files || new DataTransfer().files;
    const currentFiles = field.value ? Array.from(field.value as FileList) : [];
    const newFiles = Array.from(files);

    const maxFiles = 5;
    // 현재 파일과 새로 추가할 파일을 합쳐서 최대 갯수만큼 자르기
    const allFiles = currentFiles.concat(newFiles).slice(0, maxFiles);

    const dataTransfer = new DataTransfer();
    allFiles.forEach(file => dataTransfer.items.add(file));

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
