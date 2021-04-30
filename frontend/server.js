const express = require("express");
const next = require("next");
const fs = require("fs");
const path = require("path");
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

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



app
  .prepare()
  .then(() => {
    const server = express();
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    (function create(folder, object) {
      console.log("hit?");
      for (let key in object) {
      //  console.log(object[key], object[key].hasOwnProperty("file"))
        console.log(getNested(object[key], "type"), "type has been located")
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
        } else if((getNested(object[key], "type") === "file")) {
          fs.writeFile(path.join(__dirname, folder + key), '', function (err) {
            if (err) return console.log(err);
            console.log(object[key], "Created file");
          });

        }
      }
    })("/public/", root);

    fs.writeFile("public/test/helloworld.txt", "", function (err) {
      if (err) return console.log(err);
      console.log("Hello World > helloworld.txt");
    });

    server.listen(3030, (err) => {
      if (err) throw err;
      console.log("server ready on port 3030");
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });

  // get next nested object property
  function getNested(obj, ...args) {
    return args.reduce((obj, level) => obj && obj[level], obj)
  }

/**
   *    (function create(folder, o) {
      console.log("hit?");
      for (let key in o) {
        if (typeof o[key] === "object" && o[key] !== null) {
          fs.mkdir(folder + key, function () {
            if (Object.keys(o[key]).length) {
              console.log(o[key], "Created folder");
              create(folder + key + "/", o[key]);
            }
          });
        } else {
          console.log(o[key], "Created file");
          fs.writeFile(folder + key + (o[key] === null ? "" : "." + o[key]));
        }
      }
    })("/", test);
   */

/*GET /path/{mypath} should return the data about the given path.
   For directories, it should only include direct children, not the full subtree (otherwise it would not work on a real filesystem with millions of files). */
