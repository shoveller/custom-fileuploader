import { uniqBy } from "lodash-es";
import { ChangeEventHandler, FC } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import makeFileID from "./makeFileID";

const useOnFileChange = <T extends FieldValues>(field: FieldValues) => {
    const { setError, clearErrors } = useFormContext<T>();
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
        setError(field.name, {
          type: 'maxFiles',
          message: `최대 ${maxFiles}개의 파일만 첨부할 수 있습니다.`
        });
        e.target.value = ''; // input 초기화
        return;
      }
  
      clearErrors(field.name);
      const files = fileDatas.map(data => data.file)
      field.onChange(files);
      
      e.target.value = '';
    }
    
  
    return onChange
  }

type FielInputProps = {field: FieldValues, id: string}

const FielInput: FC<FielInputProps> = ({ field, id }) => {
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

export default FielInput