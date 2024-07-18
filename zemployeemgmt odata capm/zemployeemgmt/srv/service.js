const cds = require("@sap/cds");
const { Readable, PassThrough } = require("stream");

module.exports = (srv => {
    let { EMPLOYEE, MODULE, FILE } = srv.entities;

    srv.before("CREATE", EMPLOYEE, async (req) => {
        let db = await cds.connect.to('db');
        let tx = db.tx(req);
        try {
            let sQuery = `SELECT MAX(EMP_ID) AS COUNT FROM ${EMPLOYEE}`;
            let employeeTable = await tx.run(sQuery);
            employeeTable[0].COUNT = employeeTable[0].COUNT + 1;
            req.data.EMP_ID = employeeTable[0].COUNT;
        } catch (error) {
            console.log(error);
        }
    });

    srv.before("DELETE", EMPLOYEE, async (req) => {
        let { EMP_ID } = req.data;
        let oEmployeeObj = {
            "sMessage": "Employee deleted successfully",
            "sDeepMessage": `Emplpoyee ${EMP_ID} deleted successfully`
        };
        let { res } = req.http
        res.send(oEmployeeObj)
    });

    srv.before("CREATE", FILE, async (req) => {
        let { FILE_ID } = req.data;
        req.data.URL = `/odata/FILE(${FILE_ID})/CONTENT`;
    });

    srv.on('UPDATE', FILE, async (req, next) => {
        let db = await cds.connect.to('db');
        try {
            const url = req._.req.path
            if (url.includes('CONTENT')) {
                const sFileId = req.data.FILE_ID;
                var fileObj = await db.read(FILE,sFileId);
                if (!fileObj) {
                    req.reject(404, 'File not found.')
                    return
                }
                const stream = new PassThrough()
                const aFileData = []
                stream.on('data', chunk => {
                    aFileData.push(chunk)
                })
                stream.on('end', () => {
                    fileObj.CONTENT = Buffer.concat(aFileData).toString('base64');
                    console.log(body.toString());
                    // fileObj.update(body);
                })
                req.data.CONTENT.pipe(stream);
            } else return next()  
        } catch (error) {
            console.log(error);
        }
       
    })

    srv.on("READ", FILE, async (req, next) => {
        if (!req.data.FILE_ID) {
            return next();
        }

        const url = req._.req.path;
        if (url.includes("CONTENT")) {
            const sFileId = req.data.FILE_ID;
            var tx = cds.transaction(req);
            var fileObj = await tx.run(SELECT.one.from(req.target, ["CONTENT", "MEDIA_TYPE"]).where("FILE_ID =", sFileId));

            if (fileObj.length <= 0) {
                req.reject(404, "File not found.");
                return;
            }
            var decodedMedia = "";
            decodedMedia = new Buffer.from(
                fileObj.CONTENT.toString().split(";base64,").pop(),
                "base64"
            );

            return _formatResult(decodedMedia, fileObj.MEDIA_TYPE);
        }
        else return next();
    });


    function _formatResult(decodedMedia) {
        const readable = new Readable()
        const result = new Array()
        readable.push(decodedMedia)
        readable.push(null)
        result.push({ value: readable })
        return result
    }


});



