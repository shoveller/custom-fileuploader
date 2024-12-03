import './App.css'
import { useForm, FormProvider } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@hookform/error-message'
import RHFileUploader from './RHFileUploader/RHFileUploader';

const schema = z.object({
  test: z.instanceof(FileList).refine(
    (files) => files.length <= 5,
    {
      message: "최대 5개의 파일만 업로드할 수 있습니다.",
      params: { maxFiles: 5 }
    }
  )
})

function App() {
  const methods = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log, console.log)}>
      <RHFileUploader id="hello" name="test" />
      <ErrorMessage name='test' errors={methods.formState.errors} />
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
