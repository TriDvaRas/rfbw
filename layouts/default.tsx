import { ReactElement } from "react";
import { Container } from "react-bootstrap";
import { useElementSize } from "usehooks-ts";
import Navbar from "../components/Navbar";

export default function GetDefaultLayout(page: ReactElement) {
    return (
        <div className="h-100 bg-dark-900">
            <Navbar/>
            <Container fluid className="h-100 bg-dark-900 p-0">
                {page}
            </Container>
        </div>
    )
}