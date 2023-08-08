import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import Pagination from '@mui/material/Pagination'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const PDFExtractor = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedPages, setSelectedPages] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [numPages, setNumPages] = useState(null)
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 })
  const [step, setStep] = useState(0)
  const [titleImage, setTitleImage] = useState(null)
  const [summaryImage, setSummaryImage] = useState(null)

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    await handleUpload(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    setSelectedFile(file)
    handleUpload(file)
  }

  const handleUpload = async (file) => {
    const fileReader = new FileReader()
    fileReader.onload = async (e) => {
      const arrayBuffer = e.target.result
      const pdfjsLib = await import('pdfjs-dist')
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      const pages = Math.min(pdf.numPages, 10)
      const extractedPages = []

      for (let i = 0; i < pages; i++) {
        const page = await pdf.getPage(i + 1)
        const viewport = page.getViewport({ scale: 1 })
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
    }
    console.log("HOLA")

    fileReader.readAsArrayBuffer(file)
  }

  const handleTextSelection = (selectedText) => {
    if (step === 1) {
      setTitleImage(selectedText)
    } else if (step === 2) {
      setSummaryImage(selectedText)
    }
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page - 1)
  }

  const handleDraggerClick = () => {
    const fileInput = document.getElementById('file-input')
    fileInput.click()
  }

  const handleCropChange = (newCrop) => {
    setCrop(newCrop)
  }

  const handleCropComplete = (crop, pixelCrop) => {
    const canvas = document.createElement('canvas')
    const image = new Image()
    image.src = selectedPages[currentPage].image
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const context = canvas.getContext('2d')
    context.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )
    const croppedImage = canvas.toDataURL('image/jpeg')
    handleTextSelection(croppedImage)
  }

  const closeDialog = () => {
    setStep(0)
    setSelectedFile(null)
    onClose()
  }

  const steps = ['Subir PDF', 'Seleccionar Título', 'Seleccionar Resumen']

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDialog}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="lg" // Añadido para ajustar el tamaño del diálogo
      >
        <DialogTitle>{"Subir y extraer datos del documento"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Stepper activeStep={step} alternativeStep={step + 1} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {step === 0 && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{ width: '100%', height: '200px', border: '1px dashed gray', textAlign: 'center' }}
                  onClick={handleDraggerClick}
                >
                  Arrastra aquí un PDF o haz click para buscarlo
                  <input id="file-input" type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>
              )}

              {step !== 0 && selectedPages[currentPage] && (
                <div>
                  <ReactCrop
                    crop={crop}
                    onChange={handleCropChange}
                    onComplete={handleCropComplete}
                  >
                    <img src={selectedPages[currentPage].image} alt="Page" />
                  </ReactCrop>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button disabled={step === 0}
                      onClick={() => {
                        setCrop({ ...crop, unit: 'px', width: 0, height: 0 }) // Restablecer la posición del recorte
                        setStep(step - 1)
                      }}>
                      Anterior
                    </Button>
                    <Pagination
                      count={numPages}
                      page={currentPage + 1}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      style={{ margin: '20px auto' }}
                    />
                    <Button
                      disabled={step === steps.length - 1}
                      onClick={() => {
                        setCrop({ ...crop, unit: 'px', width: 0, height: 0 }) // Restablecer la posición del recorte
                        setStep(step + 1)
                      }}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div >
  )
}
export default PDFExtractor
