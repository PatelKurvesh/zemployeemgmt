const cds = require("@sap/cds");

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
        if (req.data.CONTENT) {
            try {
                if (typeof req.data.CONTENT === 'string') {
                    req.data.CONTENT = Buffer.from(req.data.CONTENT, 'base64');
                }
            } catch (error) {}
        }
        req.data.URL = `/odata/FILE(${req.data.FILE_ID})/CONTENT`;
    });


});



