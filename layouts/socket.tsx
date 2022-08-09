import { ReactElement, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useElementSize } from 'usehooks-ts';
import Head from "next/head";
import { io } from "socket.io-client";
import { NextPage } from "next";
import { useSWRConfig } from "swr";
let IO;
export default function GetSocketLayout(page: ReactElement) {
    // connected flag
    const [connected, setConnected] = useState<boolean>(false);
    const { cache, mutate } = useSWRConfig()

    useEffect((): any => {
        (async () => {
            await fetch('/api/socket');
            IO = io()
                .on('connect', () => {
                    console.log('connected')
                    setConnected(true);
                })
                .on('mutate', (matchers: string[]) => {
                    console.log(matchers);

                    for (const [key, value] of Array.from(cache as Map<string, any>)) {
                        const m = matchers.find(matcher => new RegExp(matcher).test(key))
                        if (m) {
                            console.log(`${(m)} => ${key}`);
                            mutate(key)
                        }
                    }
                })
        })()
    }, []);
    return (
        <div className="h-100 bg-dark-900">
            <Head>
                <title>RFBW</title>
            </Head>
            <Navbar />

            {/* <Button onClick={() => console.log(Array.from((cache as Map<string, any>).keys()).filter(x => x.startsWith(`/api`)).sort().join('\n'))} /> */}
            <Container className="h-100 bg-dark-900">
                {page}
            </Container>
        </div>
    )
}
