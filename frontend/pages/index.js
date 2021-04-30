import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [data, setData] = useState({});
  const [path, setPath] = useState("");

  useEffect(async () => {
    try {
      const { data } = await axios.get(`/api/path/${path}`);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }, [path]);

  const handleClick = () => {
    setPath(data.nextPath[0]);
  }

  return <div className={styles.container}>
    <button onClick={handleClick}>{data.nextPath}</button>
    <p>{data && data.currentPath}</p>
  </div>;
}
