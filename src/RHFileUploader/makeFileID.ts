const makeFileID = (file: File) => `${file.name}_${file.lastModified}`

export default makeFileID