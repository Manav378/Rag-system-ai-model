import React, { Children } from 'react'
import { createContext , useContext ,useState, useEffect } from 'react'
import api from '../api/axios'
import { toast } from 'react-toastify'

const DocumentContext = createContext()

export const DocumentProvider = ({children})=>{
    const [document, setDocument] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchDocuments = async () => {
        try {
            const res = await api.get('/upload/document')
            setDocument(res.data.documents)
        } catch (error) {
            toast.error('Document is not loaded!')
        } finally {
            setLoading(false)
        }
    }

    const addDocument = (doc)=>{
        setDocument(prev =>[...prev , doc])
    }

    const removeDocument = (fileId)=>{
        setDocument(prev=>prev.filter(doc =>doc.fileId !== fileId))
    }


      useEffect(() => {
    fetchDocuments()
  }, [])

  return (
    <DocumentContext.Provider value={{document , loading , fetchDocuments,addDocument , removeDocument}}>
        {children}
    </DocumentContext.Provider>
  )

}


export const useDocuments =  ()=>useContext(DocumentContext)
