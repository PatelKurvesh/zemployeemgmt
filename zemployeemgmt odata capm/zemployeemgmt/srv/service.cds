namespace zemployeemgmt.srv.service;

using {zemployeemgmt.db.schema as db} from '../db/schema';

service zemployeemgmt @(path:'/odata'){
    entity EMPLOYEE as projection on db.EMPLOYEE;
    entity MODULE  as projection on db.MODULE;
    entity FILE as projection on db.FILE;
}


