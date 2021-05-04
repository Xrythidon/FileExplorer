import { useState } from "react";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumb";

import { useQuery } from "react-query";

export default function Home() {
  const [path, setPath] = useState("");
  const [headers, setHeaders] = useState(null);
  const API_BASE_PATH = "/api/path/";

  //console.log(process.env.PROD_API_HOST, process.env.NEXT_ENV)
  const { isSuccess, data, isFetching } = useQuery(["directory", path], async (path) => {
    console.log(path.queryKey[1] ? path.queryKey[1] : process.env.NEXT_ENV === "development" ? API_BASE_PATH : process.env.PROD_API_HOST);

    const HOST = (process.env.NEXT_ENV === "production" ? process.env.PROD_API_HOST : "") // if production, send api host else redirect to next proxy
    const { data, headers } = await axios.get(path.queryKey[1] ? `${HOST}${path.queryKey[1]}` : `${HOST}${API_BASE_PATH}` );
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
            <div className="directory__item folder" key={index} onClick={() => handleClick(element.fileName)}>
              <i className="directory__icon fa fa-folder-open  fa-3x"></i>
              <p className="directory__filename">{element.fileName}</p>
            </div>
          );
        } else {
          return (
            <div className="directory__item file" key={index} onClick={() => handleClick(element.fileName)}>
              <i className="fa fa-file  fa-3x"></i>
              <p className="directory__filename">{element.fileName}</p>
            </div>
          );
        }
      });
    } else if (!data.nextPath) {
      return data;
    }
  };

  return (
    <div className="explorer">
      <h1 className="explorer__title">File Explorer</h1>
      {isSuccess && !isFetching ? <Breadcrumb paths={path} setPaths={setPath} API_BASE_PATH={API_BASE_PATH} /> : <p>Loading...</p>}
      <div className="directory">{isSuccess && checkTypeJSON(headers) }</div>
    </div>
  );
}
