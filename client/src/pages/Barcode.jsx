import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import ToggleButton from "../components/ToggleButton";

const Barcode = () => {
  const videoRef = useRef(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({});
  const [isCameraActive, setIsCameraActive] = useState(true);

  const fetchProduct = async (barcode) => {
    const url = `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const data = await response.json();
      const {
        code,
        product: { brands, image_url },
      } = data;
      setProduct({ barcode: code, brands, image_url });
      console.log(data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch product information.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const startDecoding = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
        setError(null); // Clear previous errors

        reader.current.decodeFromConstraints(
          {
            audio: false,
            video: { facingMode: "environment" },
          },
          videoRef.current,
          (result, error) => {
            if (result) {
              const barcode = result.getText();
              setResult(barcode);
              fetchProduct(barcode);
              setError(null); // Clear previous errors
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error(error);
              setError(error.message);
            }
          }
        );
      } catch (e) {
        console.error("Failed to start camera:", e);
        setError(
          "Failed to start camera. Please check permissions and try again."
        );
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
  }, [isCameraActive]);

  return (
    <>
      {
        <div className="p-4 ">
          {isCameraActive && (
            <video ref={videoRef} className="w-full rounded object-cover" />
          )}
          {result && (
            <div className="mt-2 text-center bg-green-300 rounded">
              <h3 className="font-semibold">Result:</h3>
              <p>{result}</p>
            </div>
          )}
          <ToggleButton
            className="p-2 border rounded-md bg-green-300 self-center mt-3"
            onClick={() => setIsCameraActive(!isCameraActive)}
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
      }
    </>
  );
};

export default Barcode;
