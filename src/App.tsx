import { Select, Tag } from "antd";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { FC, MouseEventHandler, PropsWithChildren, ReactNode } from "react";

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

const RHFileUploader = () => {
  return (
    <Controller name="test" render={({ field }) => {
      const dataTransfer = new DataTransfer()
      const fileList = (field.value || new DataTransfer().files) as FileList
      Array.from(fileList).forEach(file => dataTransfer.items.add(file));

      const options = Array.from(fileList).map(file => {
        return {
          label: file.name,
          value: makeFileID(file),
        }
      })

      return (
        <>
          <Select 
            style={{ width: 200 }} 
            onBlur={field.onBlur} 
            value={options} 
            options={options} 
            mode="multiple" 
            placeholder="선택하시요" 
            tagRender={tagRender({ onClose: (value) => {
              const index = Array.from(fileList).findIndex(file => makeFileID(file) === value)
              if (index >= 0) {
                dataTransfer.items.remove(index)
                field.onChange(dataTransfer.files)
              }
            } })} 
          />
          <FileSelectButton htmlFor="hello">
            파일 선택
          </FileSelectButton>
          <input style={{ display: 'none' }} type="file" id="hello" name={field.name} onChange={(e) => {
            dataTransfer.items.clear()
            Array.from(e.currentTarget.files|| []).forEach(file => dataTransfer.items.add(file));
            field.onChange(dataTransfer.files);
          }} onBlur={field.onBlur} ref={field.ref} multiple={true} />
        </>
      )
    }} />
  )
}

function App() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log, console.log)}>
        <RHFileUploader />
        <button type="submit">서브밋</button>
        <button type="reset">리셋</button>
      </form>
      <DevTool control={methods.control} />
    </FormProvider>
  );

}

export default App
