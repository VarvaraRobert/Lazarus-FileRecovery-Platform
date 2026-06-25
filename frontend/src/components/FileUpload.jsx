import { useState } from 'react'
import API from '../services/api'

function FileUpload({ onScanComplete }) {
  const [filePath, setFilePath] = useState('/tmp/test.img')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!filePath) return
    setLoading(true)
    setError('')
    try {
      const response = await API.post('/upload/by-path', { file_path: filePath })
      onScanComplete(response.data.scan_id)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-white text-lg font-bold mb-4">Upload Disk Image</h3>
      <input
        type="text"
        placeholder="Enter file path (e.g. /tmp/test.img)"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
      />
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <button
        onClick={handleUpload}
        disabled={!filePath || loading}
        className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Scanning...' : 'Upload & Scan'}
      </button>
    </div>
  )
}

export default FileUpload