import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, MessageSquare, Trash2, FileText, Plus } from 'lucide-react'
import { toast } from "react-toastify";
import api from "../api/axios.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useDocuments } from '../context/DocumentContext.jsx';


const Dashboard = () => {

    const {document , loading , addDocument ,  removeDocument} = useDocuments()
    const [uploading, setUploading] = useState(false);
    const [dragging, setdragging] = useState(false);
    const { theme } = useTheme()
    const navigate = useNavigate()


    

    //File upload

    const handleUpload = async (file) => {
       setUploading(true)
       const formData = new FormData()

       formData.append('file' , file)

       try {
        
       const res = await api.post('/upload', formData)
      addDocument({
        fileId: res.data.fileId,
        originalName: res.data.originalName,
        uploadedAt: new Date()
      })
      toast.success('Upload successfully! ✅')
    } catch (error) {
      toast.error('Upload failed!')
    } finally {
      setUploading(false)
    }
    }

    // Drag & Drop
    const handleDrop = (e) => {
        e.preventDefault();
        setdragging(false)
        const file = e.dataTransfer.files[0];
        handelUpload(file);
    }

    // Delete document
    const handleDelete = async (fileId) => {
        try {
            await api.delete(`/upload/${fileId}`);
            toast.success("Document deleted sucessfully!")
           removeDocument(fileId)
        } catch (error) {
            toast.error('Error during deleting')
        }
    }

    // Date format
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }






    return (
        <div>
            {/* Stack title and upload button vertically on mobile, side by side from sm breakpoint up */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-2xl font-bold">My Documents</h1>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {document.length} document{document.length !== 1 ? 's' : ''} uploaded
                    </p>
                </div>

                {/* Upload Button — full width on mobile, auto width from sm up */}
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl cursor-pointer transition w-full sm:w-auto">
                    <Plus size={18} />
                    Upload Document
                    <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(e.target.files[0])}
                    />
                </label>
            </div>

              {/* Drag & Drop Area — smaller padding on mobile */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 md:p-10 text-center mb-8 transition
          ${dragging
            ? 'border-violet-500 bg-violet-500/10'
            : theme === 'dark'
              ? 'border-gray-700 hover:border-gray-600'
              : 'border-gray-300 hover:border-gray-400'
          }`}
      >
         {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-violet-500" />
            <p className="text-violet-400">Upload ho raha hai...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={36} className="text-violet-400" />
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              PDF ya Image yahan drop karo
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              ya upar Upload button use karo
            </p>
          </div>
        )}
      </div>


       {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-40 rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      ) : document.length === 0 ? (

        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
          <FileText size={48} className="text-gray-500" />
          <h3 className="text-lg font-semibold">Koi document nahi hai</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Upar upload karo aur AI se baat karo!
          </p>
        </div>

      ) : (

        /* Documents Grid — already responsive: 1 col mobile, 2 cols tablet, 3 cols desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {document.map((doc) => (
            <div
              key={doc.fileId}
              className={`p-5 rounded-2xl border flex flex-col gap-4 transition
                ${theme === 'dark'
                  ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
            >

                              {/* Doc Info */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">
                    {doc.originalName || doc.fileId}
                  </p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatDate(doc.uploadedAt)}
                  </p>
                </div>
              </div>

{/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/chat/${doc.fileId}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl transition"
                >
                  <MessageSquare size={15} />
                  Chat
                </button>
                <button
                  onClick={() => handleDelete(doc.fileId)}
                  className={`p-2 rounded-xl transition ${theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

        </div>
    )
}

export default Dashboard