import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [data, setData] = useState(null);
  const [res, setRes] = useState(null);
  const [path, setPath] = useState("");
  const [cachedCurrentPath, setCachedCurrentPath] = useState(null);

  useEffect(async () => {
    try {
      const response = await axios.get(path ? path : "/api/path/");
      setData(response.data);
      setCachedCurrentPath(response.data.currentPath ? response.data.currentPath : path);
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
      return data.nextPath.map((element, index) => {
        if (element.fileType === "folder") {
          return (
            <button className="folder"  key={index} onClick={() => handleClick(element.fileName)}>
              {element.fileName}
            </button>
          );
        } else {
          return (
            <button className="file"  key={index} onClick={() => handleClick(element.fileName)}>
              {element.fileName}
            </button>
          );
        }
      });
    } else {
      return data;
    }
  };
  // red colour -> file
  // blue color -> folder

  return (
    <div className={styles.container}>
      <div>{res && checkTypeJSON()}</div>
      <p>{data && cachedCurrentPath}</p>
    </div>
  );
}
