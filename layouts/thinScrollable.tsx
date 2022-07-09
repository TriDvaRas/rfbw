import { ReactElement } from "react";
import { Container } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useElementSize } from 'usehooks-ts';
import CustomScroll from 'react-custom-scroll';

export default function GetThinScrollableLayout(page: ReactElement) {
    return (
        <div className="h-100 bg-dark-900">
            <Navbar />
            <Container className="h-100 bg-dark-900" style={{ maxHeight: '100%' }}>
                {page}
            </Container>
        </div>
    )
}