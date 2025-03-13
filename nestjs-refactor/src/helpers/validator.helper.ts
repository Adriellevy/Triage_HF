import { Injectable } from "@nestjs/common";

@Injectable()
export class ValidatorHelper{
    public validateUUID(uuid:string):boolean{
        const uuidRegex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        return uuidRegex.test(uuid);
    }
}