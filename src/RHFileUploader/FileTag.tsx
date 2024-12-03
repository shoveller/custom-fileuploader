import { Tag } from "antd";
import { FC, MouseEventHandler, PropsWithChildren, MouseEvent, useCallback } from "react";

type FileTagProps = {
    onClose: (e: MouseEvent<HTMLElement>) => void
};

const FileTag: FC<PropsWithChildren<FileTagProps>> = ({ children, onClose }) => {
    const onMouseDown: MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    },[]);

    return (
      <Tag
        onMouseDown={onMouseDown}
        closable
        onClose={onClose}
      >
        {children}
      </Tag>
    );
}

export default FileTag