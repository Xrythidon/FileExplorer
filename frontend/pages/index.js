import styles from "../styles/Home.module.css";
import { useState } from "react";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumb";

import { useQuery } from "react-query";

export default function Home() {
  const [path, setPath] = useState("");
  const [headers, setHeaders] = useState(null);
  const API_BASE_PATH = "/api/path/";

  const { isSuccess, data, isFetching } = useQuery(["directory", path], async (path) => {
    const { data, headers } = await axios.get(path.queryKey[1] ? path.queryKey[1] : API_BASE_PATH);
    setHeaders(headers);
    return data;
  });

  const handleClick = (nextPathElement) => {
    console.log(`/api/path${data.currentPath}${data.currentPath === "/" ? "" : "/"}${nextPathElement}`);
    setPath(`/api/path${data.currentPath}${data.currentPath === "/" ? "" : "/"}${nextPathElement}`);
  };

  const checkTypeJSON = (headers) => {
    // Check if Headers are json, then return a button according to the type
    const isJSONType = headers["content-type"].includes("application/json");
    if (isJSONType && data.nextPath) {
      return data.nextPath.map((element, index) => {
        if (element.fileType === "folder") {
          return (
            <button className="folder" key={index} onClick={() => handleClick(element.fileName)}>
              {element.fileName}
            </button>
          );
        } else {
          return (
            // cache the  filename to the path when this is clicked
            <button className="file" key={index} onClick={() => handleClick(element.fileName)}>
              {element.fileName}
            </button>
          );
        }
      });
    } else if (!data.nextPath) {
      // validate
      return data;
    }
  };
  // red colour -> file
  // blue color -> folder

  return (
    <div className={styles.container}>
      {isSuccess && !isFetching && <Breadcrumb paths={path} setPaths={setPath} API_BASE_PATH={API_BASE_PATH} />}
      <div>{isSuccess && checkTypeJSON(headers)}</div>
      {isSuccess && data.currentPath}
    </div>
  );
}
