import { CheckCircleOutline } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

const FileUploader = ({
  buttonText,
  fileTypes,
  onFileUpload,
  isLoading,
  loadingFile,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]
    fileConvert(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    fileConvert(file)
  }

  const fileConvert = (file) => {
    setLoading(true)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target.result.split(',').pop()
        onFileUpload(base64String)
        setLoading(false)
        setUploadedFileName(file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  useEffect(() => {
    if (isLoading) isLoading(loading)
  }, [loading])
  console.log({ loadingFile })
  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: 'calc(100% - 2px)',
          height: '200px',
          border: '1px dashed gray',
          display: 'flex',
          placeContent: 'center',
          placeItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => {
          setOpen(true)
          fileInputRef.current.click()
        }}
      >
        {loading || loadingFile ? (
          <CircularProgress />
        ) : uploadedFileName ? (
          <>
            <CheckCircleOutline style={{ marginRight: '5px' }} />
            {uploadedFileName}
          </>
        ) : (
          buttonText
        )}
        <input
          ref={fileInputRef}
          type={'file'}
          accept={fileTypes}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

export default FileUploader
