import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [data, setData] = useState(null);
  const [res, setRes] = useState(null);
  const [path, setPath] = useState("");

  useEffect(async () => {
    try {
      const response = await axios.get(path ? path : "/api/path/");
      setData(response.data);
      setRes(response);
    } catch (error) {
      console.error(error);
    }
  }, [path]);

  const handleClick = (nextPathElement) => {
    console.log(`/api/path${data.currentPath}${data.currentPath === "/" ? "" : "/"}${data.nextPath}`);
    setPath(`/api/path${data.currentPath}${data.currentPath === "/" ? "" : "/"}${nextPathElement}`);
  };

  const checkTypeJSON = () => {

      const isJSONType = res.headers["content-type"].includes("application/json");
      console.log(isJSONType);
      if (isJSONType && data.nextPath) {
      return  data.nextPath.map((element, index) => (
          <button key={index} onClick={() => handleClick(element)}>
            {element}
          </button>
        ))
      } else {
        return data
      }
    
  };

  //console.log(res);
  //console.log(res && res.headers["content-type"].includes("application/json"), "this is a json file");
  return (
    <div className={styles.container}>
      <div>
        {res && checkTypeJSON()}
      </div>
      <p>{data && data.currentPath}</p>
    </div>
  );
}
