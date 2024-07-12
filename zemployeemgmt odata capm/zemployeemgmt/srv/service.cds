namespace zemployeemgmt.srv.service;

using {zemployeemgmt.db.schema as db} from '../db/schema';

service zemployeemgmt {

    entity EMPLOYEE as projection on db.EMPLOYEE;
    entity MODULE  as projection on db.MODULE;
    // function sendJWT() returns String;

}


