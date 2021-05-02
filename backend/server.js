const express = require("express");
const fs = require("fs");
const path = require("path");
const colors = require("colors");
require("dotenv").config();

const app = express();
// app.use(express.json());

let root = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        myname: {
          type: "dir",
          children: {
            "filea.txt": {
              type: "file",
            },
            "fileb.txt": {
              type: "file",
            },
            projects: {
              type: "dir",
              children: {
                mysupersecretproject: {
                  type: "dir",
                  children: {
                    mysupersecretfile: {
                      type: "file",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// Redirect to static /public route
app.get("/api/potato/", (req, res, next) => {
  req.url = "/api/path";

  return app._router.handle(req, res, next);
});

app.get("/api/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/path", express.static(path.join(__dirname, "/public"), { redirect: false }), (req, res) => {
  let nextPath = [];
  fs.readdir(path.join(__dirname, `/public/${req.path}`), (err, files) => {
    try {
      files.forEach((file) => {
        console.log(file);

        // Check to see if folder
        const isFolder = (path) => {
          try {
            const stat = fs.lstatSync(path);
            return stat.isDirectory() ? "folder" : "file";
          } catch (e) {
            // lstatSync throws an error if path doesn't exist
            return "file";
          }
        };

        nextPath.push({
          fileName: file,
          fileType: isFolder(path.join(__dirname, `/public/${req.path}`, file)),
        });
      });

      res.json({
        currentPath: req.path,
        nextPath,
      });
    } catch (error) {
      console.error(error);
      res.statusCode = 400;
      res.json("You are trying to access a route that doesn't exist or do not have admin privileges too");
    }
  });

  nextPaths = [];
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in DEV on port ${PORT}`.yellow.bold));

// get next nested object property
function getNested(obj, ...args) {
  return args.reduce((obj, level) => obj && obj[level], obj);
}

(function create(folder, object) {
  for (let key in object) {
    //  console.log(object[key], object[key].hasOwnProperty("file"))
    console.log(getNested(object[key], "type"), "type has been located");
    if (typeof object[key] === "object" && !(getNested(object[key], "type") === "file")) {
      fs.mkdir(path.join(__dirname, folder + key), (err) => {
        if (err) {
          return console.error(err);
        }
        if (Object.keys(object[key]).length) {
          console.log(key, "Created folder");
          create(folder + key + "/", object[key]);
        }
      });
    } else if (getNested(object[key], "type") === "file") {
      fs.writeFile(path.join(__dirname, folder + key), `THIS IS FILE: ${key}`, function (err) {
        if (err) return console.log(err);
        console.log(object[key], "Created file");
      });
    }
  }
})("/public/", root);
