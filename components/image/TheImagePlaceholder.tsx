import {
    Card, Image as ReactImage
} from 'react-bootstrap';


interface Props {
    container: 'card' | 'raw'
}
export default function TheImagePlaceholder(props: Props) {
    const { container } = props
    return container == 'card' ?
        <Card.Img
            className='rect-img'
            variant="top"
            src={`/errorAvatar.jpg`}
        /> :
        <ReactImage
            className='rect-img'
            src={`/errorAvatar.jpg`}
        />

}