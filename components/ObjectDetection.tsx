"use client"
import { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam"
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";

import { renderPredictions } from "@/utils/rednder-pridictions"

let detectInterval: NodeJS.Timeout | null = null;

const ObjectDetection = () => {
    const [isLoading, setIsLoading] = useState(true)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const webcamRef = useRef<Webcam | null>(null);

    const runCoco = async () => {
        setIsLoading(true);

        await tf.setBackend("webgl");
        await tf.ready()

        // ✅ Load the COCO-SSD model correctly
        const net: cocossd.ObjectDetection = await cocossd.load();

        //const net = await cocossdload();
        setIsLoading(false);

        detectInterval = setInterval(() => {
            runObjectDetection(net);
        }, 10)
    }

    async function runObjectDetection(net: cocossd.ObjectDetection) {
        if (
            canvasRef.current &&
            webcamRef.current !== null &&
            webcamRef.current.video?.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // ✅ Set canvas size to match video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;


            // find detected object
            const detectedObjects = await net.detect(
                webcamRef.current.video,
                undefined,
                0.6
            )

            // console.log(detectedObjects); checking objects error heading
            const context = canvasRef.current.getContext("2d");

            renderPredictions(detectedObjects, context)

        }
    }

    const showmyVedio = () => {
        if (webcamRef.current !== null && webcamRef.current.video?.readyState === 4) {
            // const myVideoWidth = webcamRef.current.video.videoWidth;
            // const myVideoHeight = webcamRef.current.video.videoHeight ;
            const myVideo = webcamRef.current.video; // Get the video element
            if (myVideo) {
                myVideo.width = myVideo.videoWidth;
                myVideo.height = myVideo.videoHeight;
            }
        }
    };

    useEffect(() => {
        runCoco();
        showmyVedio();
    }, [])

    return (
        <section className="mt-8">
            {
                isLoading ? (
                    <div className="gradient-title">Loading AI modle...</div>
                ) : (
                    <div className="relative gradient flex justify-center items-center p-1.5 rounded-md ">
                        {/* Webcam */}
                        <Webcam
                            ref={webcamRef}
                            className="lg:h-[500px] w-full rounded-md " muted
                        >

                        </Webcam>

                        {/* canvas */}
                        <canvas
                            className="absolute top-0 left-0 z-999999 w-full lg:h-[500px]"
                            ref={canvasRef} />
                    </div>
                )


            }

        </section>
    )
}

export default ObjectDetection


