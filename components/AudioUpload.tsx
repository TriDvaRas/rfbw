import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import {
    Card, Form, Image as ReactImage, ProgressBar,
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { resolveImageFilePath } from '../util/image';
import { ApiError } from '../types/common-api';
import { Audio, Image } from '../database/db';
import { parseApiError } from '../util/error';
import useAudio from '../data/useAudio';

interface Props {
    onDrop?: () => void;
    onUploadStarted?: () => void;
    onUploaded: (audio: Audio) => void;
    onError: (err: ApiError) => void
    type: Audio['type']
    compact?: boolean
    audioId?: string
}
export default function AudioUpload(props: Props) {
    const { onDrop, onUploaded, onError, onUploadStarted, compact, audioId, type } = props
    const audio = useAudio(audioId)

    const [isDraging, setIsDraging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    function handleDrop(files: any) {
        if (onDrop)
            onDrop()
        setIsUploading(true)
        if (onUploadStarted)
            onUploadStarted()
        const form = new FormData()
        form.append("audio", files[0], files[0].name)
        form.append("type", type)
        form.append("originalName", files[0].name)
        console.log(files[0]);

        axios.post<Audio>(`/api/audios/upload`, form, {
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
                onError(parseApiError(err))
            })
    }
    const height = compact ? 36 : 40
    return (
        < Dropzone
            onDropAccepted={handleDrop}
            accept={{
                'audio/*': [
                    '.wav', '.mp3'
                ]
            }}
            maxFiles={1}
            maxSize={30 * 1024 * 1024}
            multiple={false}
            onDrop={() => setIsDraging(false)}
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
                        style={{ cursor: 'pointer', minHeight: height + 2, maxHeight: height + 2, borderColor: '#332b3f' }}
                    >
                        {
                            [
                                audio.audio && <div key={1} className='p-2' style={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {audio.audio.originalName}
                                </div>,
                                , isUploading ?
                                    <div key={3} className='image-upload-overlay-loading'>
                                        <ProgressBar now={100 * uploadProgress} style={{ height: height }} />
                                    </div> :
                                    <div key={2} className='image-upload-overlay'>
                                        <i className="bi bi-upload" style={{ fontSize: compact ? '1.50rem' : '1.75rem' }}></i>
                                    </div>
                            ]
                        }
                    </Card>
                </Form.Group>
            }
        </Dropzone >
    )
}