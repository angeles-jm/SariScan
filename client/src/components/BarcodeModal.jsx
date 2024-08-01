import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import ToggleButton from "../components/ToggleButton";
import useProducts from "../hooks/useProducts";

const BarcodeModal = ({ onClose, product, error, fetchProduct }) => {
  const videoRef = useRef(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [result, setResult] = useState(null);
  const [lastBarcode, setLastBarcode] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  // const { product, error, fetchProduct } = useProducts();

  useEffect(() => {
    if (!videoRef.current) return;

    const startDecoding = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;

        reader.current.decodeFromConstraints(
          {
            audio: false,
            video: { facingMode: "environment" },
          },
          videoRef.current,
          (result, error) => {
            if (result) {
              const barcode = result.getText();
              if (barcode !== lastBarcode) {
                setLastBarcode(barcode);
                setResult(barcode);
                fetchProduct(barcode);
              }
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error(error);
            }
          }
        );
      } catch (error) {
        console.error("Failed to start camera:", error);
      }
    };

    startDecoding();

    return () => {
      const currentReader = reader.current;
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
      currentReader.reset();
    };
  }, [isCameraActive, fetchProduct, lastBarcode]);

  useEffect(() => {
    if (!isCameraActive) {
      onClose();
    }
  }, [isCameraActive, onClose]);

  const handleToggleCamera = () => {
    setIsCameraActive((prevState) => !prevState);
  };

  return (
    <>
      {
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-20">
          <div className="relative w-auto my-6 mx-auto max-w-3xl p-10">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <video ref={videoRef} className="w-full rounded object-cover" />

              <div className="mt-2 text-center bg-green-300 rounded">
                <h3 className="font-semibold">Result:</h3>
                <p>{result}</p>
              </div>

              <ToggleButton
                className="p-2 border rounded-md bg-green-300 self-center mt-3"
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleCamera();
                }}
              >
                {isCameraActive ? "Close Camera" : "Open Camera"}
              </ToggleButton>
              {product ? (
                <div>
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.code}
                      className="rounded object-fill h-48 w-96 mt-2"
                    />
                  )}

                  <p>Barcode: {product.barcode}</p>
                  <p>Product Brand: {product.brands}</p>
                </div>
              ) : (
                error && <p className="font-bold text-red-500">{error}</p>
              )}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default BarcodeModal;
