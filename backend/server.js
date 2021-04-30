const express = require("express");
const fs = require("fs");
const path = require("path");
const colors = require("colors");

const app = express();
app.use(express.json());

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

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use('/public', express.static(path.join(__dirname, "/public")), (req, res) => {
    // fs.readdir("./public/", (err, files) => {
    //     files.forEach(file => {
    //       console.log(file);
    //     });
    //   });

    res.json("Hit public folder")
    
} )

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in DEV on port ${PORT}`.yellow.bold));

// get next nested object property
function getNested(obj, ...args) {
  return args.reduce((obj, level) => obj && obj[level], obj);
}

(function create(folder, object) {
  console.log("hit?");
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
      fs.writeFile(path.join(__dirname, folder + key), "", function (err) {
        if (err) return console.log(err);
        console.log(object[key], "Created file");
      });
    }
  }
})("/public/", root);

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
