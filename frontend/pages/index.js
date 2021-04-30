import Head from 'next/head'
import {useEffect} from "react";
import axios from "axios";
import styles from '../styles/Home.module.css'

export default function Home() {

  
  useEffect(() => {
 //   console.log(getRequest());
  },[])

  const getRequest = async () => {
    try {
      const { data } = await axios.get(`/path`);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div className={styles.container}>
      Test
    </div>
  )
}



