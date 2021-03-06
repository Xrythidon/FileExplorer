import { useEffect, useState } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

export default function Breadcrumb({ paths, setPaths, API_BASE_PATH }) {
  const [crumbs, setCrumbs] = useState([]);

  // Need to split paths into breadcrumbs using "forward slash" delimiter
  const API_BASE_PATH_ARRAY = API_BASE_PATH.trim("/").split("/");
  useEffect(() => {
    setCrumbs(
      paths
        .split("/")
        .filter((word) => word !== API_BASE_PATH_ARRAY[1] && word !== API_BASE_PATH_ARRAY[2] && word !== "")
    );
  }, [paths]);

  function handleClick(index) {
    console.info("You clicked a breadcrumb.");
    // we wanna slice everything to the right of what u clicked
    console.log(index);
    console.log(crumbs);
    const newArray = crumbs.slice(0, index + 1);
    setCrumbs(newArray);
    setPaths(`${API_BASE_PATH}${newArray.join("/")}`);
  }

  function handleClickRoot() {
    console.info("You clicked the root");
    setPaths(`${API_BASE_PATH}`);
  }

  return (
    <div className="breadcrumb__container">
      <Breadcrumbs className="test" separator="›" aria-label="breadcrumb">
        <p className={crumbs.length === 0 ? "breadcrumb__currentlySelected" : ""} onClick={handleClickRoot} key="crumb">
          root
        </p>
        {paths &&
          crumbs.map((crumb, index) => (
            <p
              className={index === crumbs.length - 1 ? "breadcrumb__currentlySelected" : ""}
              onClick={() => handleClick(index)}
              key="crumb"
            >
              {crumb}
            </p>
          ))}
      </Breadcrumbs>
    </div>
  );
}
