import { useRef, useState } from 'react'
import { formatBytes, UPLOAD_ENDPOINT } from '../utils'

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const fileInputRef = useRef(null)
  const lastSelectionKeyRef = useRef('')

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  const addFiles = (incoming) => {
    const next = Array.from(incoming || [])
    if (!next.length) return
    setFiles((prev) => [...prev, ...next])
    setUploadError('')
    setUploadSuccess('')
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    if (!files.length) {
      setUploadError('Select at least one file before uploading.')
      return
    }

    setIsUploading(true)
    setUploadError('')
    setUploadSuccess('')
    setUploadProgress(0)

    let succeeded = 0
    let failed = 0

    for (let i = 0; i < files.length; i++) {
      setUploadProgress(i)
      try {
        const formData = new FormData()
        formData.append('photos', files[i])

        const response = await fetch(UPLOAD_ENDPOINT, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')
        await response.json().catch(() => null)
        succeeded++
      } catch {
        failed++
      }
    }

    setUploadProgress(files.length)
    setIsUploading(false)

    if (failed === 0) {
      setUploadSuccess(
        `All ${succeeded} file${succeeded > 1 ? 's' : ''} uploaded successfully!`,
      )
      clearAll()
    } else if (succeeded > 0) {
      setUploadError(
        `${succeeded} uploaded, ${failed} failed. Please retry the failed files.`,
      )
    } else {
      setUploadError('Upload failed. Please try again in a moment.')
    }
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelection = (event) => {
    const pickedFiles = Array.from(event.target?.files || [])
    const selectionKey = pickedFiles
      .map((file) => `${file.name}:${file.size}:${file.lastModified}`)
      .join('|')

    // iOS Safari may fire both input and change for the same picker action.
    if (selectionKey && selectionKey === lastSelectionKeyRef.current) {
      if (event.target) event.target.value = ''
      return
    }

    if (pickedFiles.length) {
      lastSelectionKeyRef.current = selectionKey
      addFiles(pickedFiles)
    }

    // Delay reset slightly so iOS Safari fully commits the selected files first.
    setTimeout(() => {
      if (event.target) event.target.value = ''
    }, 0)
  }

  return (
    <section className="panel upload-panel" id="upload">
      <header className="panel__header">
        <div>
          <span className="section-label">Share a Moment</span>
          <h2>Upload Photos & Videos</h2>
          <p>Select as many files as you like and send them all at once.</p>
        </div>
        <div className="panel__status">
          <span>Selected</span>
          <strong>
            {files.length
              ? `${files.length} file${files.length > 1 ? 's' : ''}`
              : 'None'}
          </strong>
        </div>
      </header>

      <form className="upload-form" onSubmit={handleUpload}>
        <div
          className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
          onClick={openFilePicker}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFilePicker() }}
        >
          <div className="dropzone__icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 32V16M24 16L18 22M24 16L30 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 32V36C8 38.2091 9.79086 40 12 40H36C38.2091 40 40 38.2091 40 36V32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </svg>
          </div>
          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelection}
            onInput={handleFileSelection}
          />
          <div className="dropzone__text">
            <span className="dropzone__title">Tap to choose photos or videos</span>
            <span className="dropzone__hint">
              or drag & drop from your computer
            </span>
          </div>
        </div>

        <div className="file-list">
          {files.length ? (
            files.map((file, i) => (
              <div className="file-item" key={`${file.name}-${file.size}-${i}`}>
                <div className="file-item__info">
                  <strong>{file.name}</strong>
                  <span>
                    {file.type || 'file'} &middot; {formatBytes(file.size)}
                  </span>
                </div>
                <div className="file-item__actions">
                  {isUploading && i < uploadProgress ? (
                    <span className="file-item__tag file-item__tag--done">Done</span>
                  ) : isUploading && i === uploadProgress ? (
                    <span className="file-item__tag file-item__tag--active">
                      <span className="btn-spinner" /> Sending
                    </span>
                  ) : (
                    <>
                      <span className="file-item__tag">Ready</span>
                      {!isUploading && (
                        <button
                          type="button"
                          className="file-item__remove"
                          onClick={() => removeFile(i)}
                          aria-label={`Remove ${file.name}`}
                        >
                          &times;
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              No files selected yet. Add photos or videos to share with the couple.
            </div>
          )}
        </div>

        {isUploading && files.length > 1 && (
          <div className="upload-progress">
            <div className="upload-progress__bar">
              <div
                className="upload-progress__fill"
                style={{ width: `${(uploadProgress / files.length) * 100}%` }}
              />
            </div>
            <span className="upload-progress__text">
              Uploading {Math.min(uploadProgress + 1, files.length)} of {files.length}...
            </span>
          </div>
        )}

        <div className="form-actions">
          <button className="btn primary" type="submit" disabled={isUploading}>
            {isUploading ? (
              <>
                <span className="btn-spinner" />
                Uploading...
              </>
            ) : (
              `Send ${files.length > 1 ? `${files.length} Files` : 'to Gallery'}`
            )}
          </button>
          <button
            className="btn secondary"
            type="button"
            onClick={clearAll}
            disabled={!files.length || isUploading}
          >
            Clear All
          </button>
          <div className="size-meta">
            {formatBytes(totalSize) || '0 B'}
          </div>
        </div>

        <div className="status" role="status">
          {uploadError && <span className="status--error">{uploadError}</span>}
          {uploadSuccess && (
            <span className="status--success">{uploadSuccess}</span>
          )}
        </div>
      </form>
    </section>
  )
}
