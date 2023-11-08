import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Pagination from '@mui/material/Pagination'
import Slide from '@mui/material/Slide'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import React, { useEffect, useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { pdfjs } from 'react-pdf'
import SimpleBar from 'simplebar-react'
import useClassifier from '../../hooks/useClassifier'
import ApiConnection from '../../utils/apiConnection'
import FileUploader from '../common/FileUploader'

const steps = [
  'Seleccionar Portada',
  'Seleccionar Título',
  'Seleccionar Resumen',
]

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString()

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={'up'} ref={ref} {...props} />
})

const PDFExtractor = ({ open, onClose }) => {
  const { doc, setDoc } = useClassifier()
  const [base64PdfFile, setBase64PdfFile] = useState(null)
  const [selectedPages, setSelectedPages] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [numPages, setNumPages] = useState(null)
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 })
  const [step, setStep] = useState(0)
  const [titleImage, setTitleImage] = useState(null)
  const [img, setImg] = useState(null)
  const [summaryImage, setSummaryImage] = useState(null)
  const [updatingFile, setUpdatingFile] = useState(false)
  const [loading, setLoading] = useState(false) // Estado para controlar la carga

  const base64ToFile = (base64String) => {
    try {
      const byteCharacters = atob(base64String)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      return new File([byteArray], 'filename.jpg', { type: 'image/jpeg' })
    } catch (error) {
      console.error('El string base64 no es válido')
    }
  }

  const handleUpload = async (base64) => {
    setBase64PdfFile(base64)
    setUpdatingFile(true)
    const fileReader = new FileReader()
    fileReader.onload = async (e) => {
      const arrayBuffer = e.target.result
      const pdfjsLib = await import('pdfjs-dist')
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      const pages = pdf.numPages < 10 ? pdf.numPages : 10
      const extractedPages = []

      for (let i = 0; i < pages; i++) {
        const page = await pdf.getPage(i + 1)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: context, viewport }).promise
        const image = canvas.toDataURL('image/jpeg')
        extractedPages.push({ pageNumber: i + 1, image })
      }

      setSelectedPages(extractedPages)
      setCurrentPage(0)
      setNumPages(pages)
      setStep(step + 1)
      setCrop({ ...crop, unit: 'px', width: 0, height: 0 }) // Restablecer la posición del recorte
      setUpdatingFile(false)
    }

    fileReader.readAsArrayBuffer(base64ToFile(base64))
  }

  const handleTextSelection = (selectedImg) => {
    switch (step) {
      case 1:
        setImg(selectedImg.split('data:image/png;base64,')[1])
        break
      case 2:
        setTitleImage(selectedImg)
        break
      case 3:
        setSummaryImage(selectedImg)
        break
    }
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page - 1)
  }

  const handleCropChange = (newCrop) => {
    setCrop(newCrop)
  }

  const handleCropComplete = (pixelCrop, crop) => {
    const canvas = document.createElement('canvas')
    const image = new Image()
    image.src = selectedPages[currentPage].image
    const scaleX = image.width / 100
    const scaleY = image.height / 100
    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    )
    const croppedImage = canvas.toDataURL('image/png')
    handleTextSelection(croppedImage)
  }

  const closeDialog = () => {
    if (!updatingFile) {
      setStep(0)
      setBase64PdfFile(null)
      setImg(null)
      setTitleImage(null)
      setSummaryImage(null)
      onClose()
    }
  }
  const extractText = async () => {
    const api = ApiConnection()
    const data = await api.post('documents/text-extractor/', {
      title: titleImage,
      summary: summaryImage,
    })
    if (api.status < 400) return data

    return { title: '', summary: '' }
  }

  const handleFinish = async () => {
    setLoading(true) // Activar el estado de carga
    const { title, summary } = await extractText()
    closeDialog()
    setDoc({ ...doc, title, summary, pdf: base64PdfFile, img })
    setLoading(false) // Desactivar el estado de carga
  }

  useEffect(() => {
    if (open && doc.pdf) handleUpload(doc.pdf)
  }, [open, doc.pdf])

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
      aria-describedby={'alert-dialog-slide-description'}
      maxWidth={'xs'} // Añadido para ajustar el tamaño del diálogo
      fullWidth
    >
      <DialogTitle>Subir y extraer datos del documento</DialogTitle>
      <DialogContent>
        {step !== 0 && (
          <DialogContentText id={'alert-dialog-slide-description'}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Stepper
                activeStep={step - 1}
                alternativeStep={step}
                alternativeLabel
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
          </DialogContentText>
        )}

        {step === 0 && (
          <FileUploader
            buttonText={'Haz click o arrastra un .pdf a clasificar'}
            loadingFile={updatingFile}
            fileTypes={['.pdf']}
            onFileUpload={handleUpload}
          />
        )}

        {step !== 0 && selectedPages[currentPage] && (
          <SimpleBar
            onTouchStart={(e) => {
              e.stopPropagation()
            }}
            style={{
              maxHeight: '50vh',
              width: 390,
              maxWidth: '70vw',
              textAlign: 'center',
            }}
          >
            <ReactCrop
              crop={crop}
              onChange={handleCropChange}
              onComplete={handleCropComplete}
            >
              <img src={selectedPages[currentPage].image} alt={'Page'} />
            </ReactCrop>
          </SimpleBar>
        )}
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: 'center',
          display: step !== 0 ? undefined : 'none',
        }}
      >
        <Button
          disabled={step === 0}
          onClick={() => {
            setCrop({ ...crop, unit: 'px', width: 0, height: 0 }) // Restablecer la posición del recorte
            setSummaryImage(null)
            setTitleImage(null)
            setStep(step - 1)
          }}
          size={'small'}
          variant={'outlined'}
        >
          Ant
        </Button>
        <Pagination
          count={numPages || 0}
          page={currentPage + 1}
          onChange={handlePageChange}
          color={'primary'}
          size={'small'}
          style={{ margin: '20px auto' }}
        />
        {step === steps.length - 1 ? (
          <Button
            disabled={(!summaryImage && step === 3) || loading}
            onClick={handleFinish}
            variant={'outlined'}
            size={'small'}
            style={{ width: 80 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Finalizar'}
          </Button>
        ) : (
          <Button
            disabled={(!img && step === 1) || (!titleImage && step === 2)}
            onClick={() => {
              setCrop({ ...crop, unit: 'px', width: 0, height: 0 }) // Restablecer la posición del recorte
              setStep(step + 1)
            }}
            size={'small'}
            variant={'outlined'}
          >
            Sig
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
export default PDFExtractor
