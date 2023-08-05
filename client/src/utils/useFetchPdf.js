import { useState } from "react";
import { URL } from "./constants";

export default function useFetchPdf () {
  const [text, setText] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
  headers.append('Access-Control-Allow-Credentials', 'true');

  headers.append('GET', 'POST', 'OPTIONS');

    const fetchPdf = async (formData) => {
    try {
      setLoading(true);
      await fetch(URL, {
        headers: headers,
        method: "post",
        body: formData,
      })
        .then((res) => {
          return res.text();
        })
        .then((extractedText) => {
          setText(extractedText.replace(/(\r\n|\n|\r)/gm, " "));
        });
    } catch (err) {
      setError(err);
    } finally {}
    setLoading(false);
  };

  return {text, error, loading, fetchPdf}

};
