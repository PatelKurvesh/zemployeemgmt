namespace zemployeemgmt.db.schema;

using {managed} from '@sap/cds/common';

entity EMPLOYEE : managed {
    key EMP_ID         : Int32;
        EMP_NAME       : String;
        EMP_SALARY     : String;
        EMP_CTC        : String;
        EMP_EXPERIENCE : String;
        EMP_MODULE     : Association to one MODULE;
};

entity MODULE {
    key MODULE_ID   : String;
        MODULE_NAME : String;
        MODULE_TYPE : String;
        MODULE_CODE : String;
};

entity FILE {
    key FILE_ID    : UUID;

        @Core.MediaType  : MEDIA_TYPE
        CONTENT    : LargeBinary;

        @Core.IsMediaType: true
        MEDIA_TYPE : String;
        FILE_NAME  : String;
        URL        : String
}
