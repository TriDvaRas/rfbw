import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import {
    Card, Form, Image as ReactImage, ProgressBar,
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { resolveImageFilePath } from '../util/image';
import { ApiError } from '../types/common-api';
import { Image } from '../database/db';

interface Props {
    onDrop?: (fileURL: string) => void;
    onUploadStarted?: () => void;
    onUploaded: (image: Image) => void;
    placeholderUrl?: string;
    onError: (err: ApiError) => void
    allowGif?: boolean
    imageType: Image['type']
}
export default function ImageUpload(props: Props) {
    const { onDrop, onUploaded, placeholderUrl, onError, allowGif, onUploadStarted } = props

    const [imagePreview, setImagePreview] = useState<string | undefined>(placeholderUrl)
    const [isDraging, setIsDraging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    function handleDrop(files: any) {
        const preview = URL.createObjectURL(files[0])
        setImagePreview(preview)
        if (onDrop)
            onDrop(preview)
        setIsUploading(true)
        if (onUploadStarted)
            onUploadStarted()
        const form = new FormData()
        form.append("image", files[0], files[0].name)
        form.append("type", "player")
        axios.post<Image>(`/api/images/upload`, form, {
            headers: { 'content-type': 'multipart/form-data' },
            onUploadProgress: data => {
                setUploadProgress(Math.round((100 * data.loaded) / data.total))
            },
        })
            .then((res) => {
                setIsUploading(false)
                onUploaded(res.data)
            })
            .catch((err: AxiosError<ApiError>) => {
                setIsUploading(false)
                onError(typeof err.response?.data == 'object' ? err.response.data : { error: err.message || 'Unknown Error', status: +(err.status || 500) })
            })
    }
    return (
        < Dropzone
            onDropAccepted={handleDrop}
            accept={{ 'image/png': ['.png'], 'image/jpg': ['.jpg', '.jpeg'], ...(allowGif ? { 'image/gif': ['.gif'] } : {}) }}
            maxFiles={1}
            maxSize={26214400}
            multiple={false}
            onDrop={() => setIsDraging(false)
            }
            onDragEnter={() => setIsDraging(true)}
            onDragLeave={() => setIsDraging(false)}
        >
            {({ getRootProps, getInputProps }) =>
                <Form.Group  {...getRootProps()}>
                    {//@ts-ignore
                        <Form.Control id={`file-input`} as={'input'} {...getInputProps()} />
                    }
                    <Card
                        className={`bg-dark-900 image-upload-container ${isDraging ? 'bg-dark-700' : ''}`}
                        style={{ cursor: 'pointer', minHeight: 42, maxHeight: 42 }}
                    >
                        {imagePreview ? [
                            <ReactImage key={1} alt={'img'} src={resolveImageFilePath(imagePreview, 'comp')} className='image-upload-image' />,
                            isUploading ? <div key={3} className='image-upload-overlay-loading  '>
                                <ProgressBar now={100 * uploadProgress} style={{ height: 40 }} />
                            </div> :
                                <div key={2} className='image-upload-overlay'><i className="bi bi-upload fs-3"></i></div>
                        ] : [
                            <div key={1} className='image-upload-overlay'></div>,
                            <i key={2} className="bi bi-upload fs-3"></i>
                        ]}
                    </Card>
                </Form.Group>
            }
        </Dropzone >
    )
}