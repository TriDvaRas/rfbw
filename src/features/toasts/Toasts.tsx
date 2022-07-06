import dateFormat from 'dateformat';
import { useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import TimeAgo from 'react-timeago';
//@ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { IToast } from '../../util/interfaces';
//@ts-ignore
import ruDateFormater from './ruDateFormater';
import './toasts.sass';
import { deleteToast, hideToast, selectToasts, showToast } from './toastsSlice';
import toastStyles from './toastStyleMap';
const formatter = buildFormatter(ruDateFormater)

export default function Toasts() {
    const toasts = useSelector(selectToasts)
    const dispatch = useDispatch()
    function handleClose(id: number) {
        dispatch(hideToast(id))
    }

    useEffect(() => {
        for (const toast of toasts) {
            if (toast.new)
                setTimeout(() => {
                    dispatch(showToast(toast.id))
                }, 10);
            else if (!toast.show && toasts.length > 30)
                setTimeout(() => {
                    dispatch(deleteToast(toast.id))
                }, 1000);
        }
    }, [dispatch, toasts])

    return <div className='toasts-container'>
        {
            toasts.map((toast: IToast, i, arr) => {
                const style = toastStyles.get(toast.type)
                return (
                    <Toast
                        style={{ minWidth: '250px' }}
                        show={toast.show}
                        className={`${style?.containerClasses}`}
                        key={i}
                        autohide={!!toast.autohide}
                        delay={toast.autohide}
                        onClose={() => handleClose(toast.id)}
                    >
                        <Toast.Header closeButton className={`${style?.headerClasses}`} style={!toast.text ? {borderBottom:'none'} : {}}>
                            <strong className="mr-auto">{toast.title}</strong>
                            <small className="ml-2"><TimeAgo date={new Date(+toast.date)} title={dateFormat(new Date(+toast.date), `dd.mm.yyyy HH:MM:ss`)} formatter={formatter} /></small>
                        </Toast.Header>
                        {
                            toast.text ?
                                <Toast.Body className={`${style?.bodyClasses}`} >
                                    {`${toast.text}`}
                                </Toast.Body> :
                                null
                        }
                    </Toast>
                )
            })
        }
    </div>
}
