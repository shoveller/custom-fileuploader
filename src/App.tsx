import { Select, Tag } from "antd";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={value}
      onMouseDown={onMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginInlineEnd: 4,
      }}
    >
      {label}
    </Tag>
  );
};

const RHFileUploader = () => {
  return (
    <Controller name="test" render={({ field }) => {
      const dataTransfer = new DataTransfer()
      const files = (field.value || []) as File[]
      files.forEach(file => dataTransfer.items.add(file));

      const options = files.map(file => {
        return {
          value: file.name
        }
      })

      return (
        <>
          <Select style={{ width: 200 }} onBlur={field.onBlur} value={options} options={options} mode="multiple" placeholder="선택하시요" tagRender={tagRender} />
          <label htmlFor="hello">
            파일 선택
          </label>
          <input style={{ display: 'none' }} type="file" id="hello" name={field.name} onChange={(e) => {
            dataTransfer.items.clear()
            Array.from(e.currentTarget.files|| []).forEach(file => dataTransfer.items.add(file));
            field.onChange(Array.from(dataTransfer.files));
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
