import { Container, Toast } from "react-bootstrap";


export default function Forbidden() {
    return (
        <Container>
            <Toast className='bg-dark mx-auto border-danger my-3'>
                <Toast.Header   className='bg-danger text-light fs-2' closeButton={false}>
                    Нет...
                </Toast.Header>
                <Toast.Body>
                    Попробуй еще раз, если не поможет пиши кому надо...
                </Toast.Body>
            </Toast>
            
        </Container>
    )
}