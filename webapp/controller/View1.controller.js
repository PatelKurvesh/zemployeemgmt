sap.ui.define([
    "./App.controller",
    "sap/m/MessageBox"
],
    function (BaseController, MessageBox) {
        "use strict";

        return BaseController.extend("zemployeemgmt.controller.View1", {
            onInit: function () {
                this.getModel().setUseBatch(false);
                this.getView().byId("projectTable").setVisible(false);
                this.readModuleDropDown();
                this.readEmployee();
            },

            readModuleDropDown: function () {
                var oProjectModel = this.getModel();
                oProjectModel.read("/MODULE", {
                    success: function (oData) {
                        debugger;
                        this.getModel("Employee").setProperty("/ModuleItems", oData.results);
                    }.bind(this),
                    error: function (oError) {
                        debugger;
                    }
                });
            },

            readEmployee: function () {
                var oEmployeeModel = this.getModel();
                oEmployeeModel.read("/EMPLOYEE", {
                    success: function (oData) {
                        this.getModel("Employee").setProperty("/Employee", oData.results);
                    }.bind(this),
                    error: function (error) {

                    }
                })
            },

            onProjectChange: function (oEvent) {
                // debugger;
                var oSelectedItem = oEvent.mParameters.selectedItem;
                var oSelectedModule = oSelectedItem.getBindingContext("Employee").getObject();
                this.getModel("Employee").setProperty("/SelectedModule", [oSelectedModule]);
                var sModuleId = oSelectedModule.MODULE_ID;
                var oModuleFilter = new sap.ui.model.Filter({
                    path: "EMP_MODULE_MODULE_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: sModuleId
                });
                // this.setBusy();

                this.getModel().read("/EMPLOYEE", {
                    filters: [oModuleFilter],
                    success: function (oData) {
                        // debugger;
                        this.getModel("Employee").setProperty("/Employee", oData.results);
                        this.getView().byId("projectTable").setVisible(true);
                        sap.m.MessageToast.show("Employee data loaded sucessfully");
                    }.bind(this),
                    error: function (oError) {
                        // debugger;
                    }
                })
            },

            onCreate: function () {
                if (!this.Dialog) {
                    this.Dialog = sap.ui.xmlfragment("zemployeemgmt.fragments.create", this);
                    this.getView().addDependent(this.Dialog);
                    this.Dialog.open();
                } else {
                    this.Dialog.open();
                    sap.ui.getCore().byId("INP_ID").setValue("");
                    sap.ui.getCore().byId("INP_NAME").setValue("");
                    sap.ui.getCore().byId("INP_SALARY").setValue("");
                    sap.ui.getCore().byId("INP_CTC").setValue("");
                    sap.ui.getCore().byId("INP_EXP").setValue("");
                    sap.ui.getCore().byId("INP_MODULE").setValue("");

                }
            },

            onCancelDialog: function () {
                this.Dialog.close();
                if (this.Dialog) {
                    this.Dialog.destroy();
                    this.Dialog = null;
                }
            },

            onAddNewEmp: function () {
                var oId = sap.ui.getCore().byId("INP_ID").getValue();
                var oName = sap.ui.getCore().byId("INP_NAME").getValue();
                var oSalary = sap.ui.getCore().byId("INP_SALARY").getValue();
                var oCTC = sap.ui.getCore().byId("INP_CTC").getValue();
                var oExp = sap.ui.getCore().byId("INP_EXP").getValue();
                var oModule = sap.ui.getCore().byId("INP_MODULE").getSelectedKey();
                var oAddNewEmployee = {
                    "EMP_ID": oId,
                    "EMP_NAME": oName,
                    "EMP_SALARY": oSalary,
                    "EMP_CTC": oCTC,
                    "EMP_EXPERIENCE": oExp,
                    "EMP_MODULE_MODULE_ID": oModule
                };


                var oNewEmp = this.getModel();
                oNewEmp.create("/EMPLOYEE", oAddNewEmployee, {
                    success: function (oData) {
                        debugger;
                        var oEmployeeModel = this.getModel("Employee");
                        var aEmployeeItems = oEmployeeModel.getProperty("/Employee")
                        aEmployeeItems.push(oData);
                        oEmployeeModel.refresh(true);
                        this.onCancelDialog();
                        MessageBox.success(`Employee ${oData.EMP_NAME} created successfully`);
                    }.bind(this),
                    error: function (error) {
                        var oErrorObj = JSON.parse(error.responseText);
                        var sErrorMsg = oErrorObj.error.message.value;
                        sErrorMsg === "Entity already exists" ? MessageBox.warning("Employee already exists") : MessageBox.warning(sErrorMsg);

                    }
                });
            }
        });
    });
