const fs = require('fs');
const fileUpload = require('express-fileupload');
const xml2js = require('xml2js');

const TMP_PATH = "tmp"

var mindMapListPage = '<html>No Mind Maps Detected</html>'


exports.handleFileUpload = function(req, res) {
    let file = req.files.uploadedFile;
    if(file.mimetype == "text/xml") {
        let xmlparser = new xml2js.Parser();
        let name = file.name.replace(/.\w\w\w$/,'');
        xmlparser.parseString(file.data, (err, result) => {
            let jsonstring = JSON.stringify(result);
            createMindMapPage(name, jsonstring, res);
        })

    }
}

exports.getMindMapListPage = function() {
    return mindMapListPage;
}

function createMindMapPage(title, jsonstring, res) {
    let snakeCaseTitle = title.toUpperCase().replace(/\s/g, "_");
    let dashCaseTitle = title.replace(/\s/g, "-");
    let head = `
    <head>
    <title>${title}</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="../styles.css">
    </head>
    `
    let body = `
    <body>
    <h1>${title}</h1>
    </body>
    `
    let bottomscripts = `
    <script type="text/javascript" src="../mindmap.js"></script>
    <script type="text/javascript">
        const ${snakeCaseTitle} = ${jsonstring};
    </script>
    <script type="text/javascript"> //assemble </script>
    `

    let fullhtml = `<html>${head}${body}${bottomscripts}</html>`;

    fs.writeFile(`${TMP_PATH}/${dashCaseTitle}.html`, fullhtml, ()=> {
        console.log('new html file created');
        sendMindMapListPage(res);
    })
}



function sendMindMapListPage(res) {
    let existing_mindmaps = [];
    let head = `
    <head>
    <title>Mind Maps</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="../styles.css">
    </head>
    `
    let body = `<body><h1>Mind Maps</h1>`
    fs.readdir(TMP_PATH, function(error, files) {
        mindmaps = files;
        for(i in mindmaps) {
            body += `<a href=${TMP_PATH}/${mindmaps[i]}><div>${mindmaps[i]}</div></a>`
        }
        body += `</body>`
        mindMapListPage = '<html>' + head + body + '</html>'
        res.send(mindMapListPage);
    });

}

