
// Parse comma separated list of process interfaces into an object
import { isValid } from "@/utils";

export const parseInterfaces = function(text) {
    let result = { internal: false, external: false, customer: false, process: new Set() };

    if(isValid(text) && text.length > 0) {
        let itfs = text.split(",");
        for(const itf of itfs) {
            const i = itf.trim();
            switch(i.toLowerCase()) {
                case "internal": result.internal = true; break;
                case "external": result.external = true; break;
                case "customer": result.customer = true; break;
                default:
                    result.process.add(i);
                    break;
            }
        }
    }

    return result;
}

// Turn an object returned by parseInterfaces() into a comma separated list of process interfaces
export const interfaceList = function(interfacesWith, t, useNames = true, separator = " ") {
    let interfaces = "";
    if(interfacesWith.internal)
        interfaces += useNames ? t('ims.internal') : "Internal";
    if(interfacesWith.external) {
        if(interfaces.length > 0)
            interfaces += `,${separator}`;
        interfaces += useNames ? t('ims.external') : "External";
    }
    if(interfacesWith.customer) {
        if(interfaces.length > 0)
            interfaces += `,${separator}`;
        interfaces += useNames ? t('ims.customer') : "Customer";
    }
    for(const itf of interfacesWith.process) {
        if(interfaces.length > 0)
            interfaces += `,${separator}`;
        interfaces += itf;
    }
    return interfaces;
}
