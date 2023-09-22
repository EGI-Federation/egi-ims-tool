import { isValid, makeEnum } from "@/utils";
import { store } from "@/store";

// Define all the roles in the IMS
export const Roles = {

    VO: makeEnum(['member']),
    IMS: makeEnum(['process-staff','ims-owner','ims-manager','ims-coordinator','ims-developer']),
    BA: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    BDS: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    CAPM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    CHM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    COM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    CONFM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    CPM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    CRM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    CSI: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    FA: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    HR: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    ISM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    ISRM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    PKM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    PM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    PPC: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    PPM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    RDM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    RM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    SACM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    SLM: makeEnum(['process-staff','process-owner','process-manager','process-developer','catalog-owner','sla-owner','ola-owner','ua-owner','report-owner']),
    SPM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    SRM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
    SUPPM: makeEnum(['process-staff','process-owner','process-manager','process-developer','report-owner']),
};

// Takes in a role name such as "process-owner", returns details of the role, including its role constant (Symbol)
export const getRoleByName = function(roleEnum, roleName) {

    for(let name in roleEnum) {
        const role = roleEnum[name];
        const regexRole = role.description.replace("-", "\\-") + "(?:\\-([^\\#]+))?";
        let regex = new RegExp(regexRole, "ig");
        let matches = regex.exec(roleName);
        if(isValid(matches)) {
            let roleInfo = { role: role };
            const objectId = matches[1];
            if(isValid(objectId))
                roleInfo.objectId = objectId;
            else
                roleInfo.assigned = true;

            return roleInfo;
        }
    }

    return null;
}

// Parse user roles from the entitlements the user has
export const rolesFromEntitlements = function(entitlements, trace) {
    console.log("Parsing roles...");

    let roles = new Map();
    const vo = process.env.EGI_VO || "vo.tools.egi.eu";
    const voPrefix = "urn:mace:egi.eu:group:" + vo + ":";
    const suffix = "#aai.egi.eu";

    const entVoMember = voPrefix + vo + "role=member" + suffix;
    let voMember = entitlements.filter((ent) => entVoMember === ent);
    if(0 === voMember.size) {
        console.log("Not member or the VO");
        return null;
    }

    roles.set(Roles.VO.MEMBER, { name: "vo-member", assigned: true });

    // Only continue checking the roles for members of the VO
    // First, build a list of roles to check (iterates through the entitlements once per role group)
    let rolesToCheck = [];
    for(const group in Roles) {
        const groupRoles = Roles[group];
        const rolePrefix = voPrefix + group + ":role=";
        const entGroupMember = rolePrefix + "member" + suffix;

        let groupMember = entitlements.filter((ent) => entGroupMember === ent);
        if (0 === groupMember.length)
            continue;

        // Member of the group, which is a prerequisite to holding group roles
        roles.set(groupRoles.MEMBER, { name: group.toLowerCase() + "-member", assigned: true });

        const regexPrefix = "urn\\:mace\\:egi\\.eu\\:group\\:" + vo + "\\:" + group + "\\:role=";

        for(let roleName in groupRoles) {
            const role = groupRoles[roleName];
            if("member" === role.description)
                continue;

            const regexRole = regexPrefix + role.description.replace("-", "\\-") + "(?:\\-([^\\#]+))?" + suffix;
            let roleDetails= { name: group.toLowerCase() + "-" + role.description,
                                    role: role,
                                    assigned: false,
                                    regex: new RegExp(regexRole, "ig"),
                                    ownedEntities: new Set() };
            rolesToCheck.push(roleDetails);
        }
    }

    // Got a list of roles to check
    // Iterate just once more through the entitlements, check each against all roles in the groups the user is a member of
    for(const entitlement of entitlements) {
        for(let roleDetails of rolesToCheck) {
            // Check the role against the entitlement
            let matches = roleDetails.regex.exec(entitlement);
            if(isValid(matches)) {
                const objectId = matches[1];
                if(isValid(objectId))
                    roleDetails.ownedEntities.add(objectId);
                else
                    roleDetails.assigned = true;
            }
        }
    }

    for(const roleDetails of rolesToCheck) {
        if(roleDetails.assigned || (isValid(roleDetails.ownedEntities) && roleDetails.ownedEntities.size > 0))
            roles.set(roleDetails.role, { name: roleDetails.name, assigned: roleDetails.assigned, ownedEntities: roleDetails.ownedEntities });
    }

    if(trace || process.env.TRACE_ROLES) {
        const assigned = [...roles].filter(([k, v]) => v.assigned && "member" !== k.description);
        console.log("Got " + assigned.length + " roles" + (roles.size > 0 ? ":" : ""));
        for(const role of roles) {
            // role is array with [key, value]
            const roleDetails = role[1];
            if(roleDetails.assigned)
                console.log("\t" + roleDetails.name);
            if(isValid(roleDetails.ownedEntities) && roleDetails.ownedEntities.size > 0) {
                for(const objectId of roleDetails.ownedEntities) {
                    console.log("\t\t" + roleDetails.name + "-" + objectId);
                }
            }
        }
    }

    return roles;
}

// Extract roles
export const parseRoles = function() {
    if(isValid(store.state.oidc.is_checked) && isValid(store.state.oidc.user)) {
        const user = store.state.oidc.user;
        if(isValid(user.eduperson_entitlement)) {
            const entitlements = user.eduperson_entitlement;
            const roles = rolesFromEntitlements(entitlements, false);
            if(null != roles)
                store.commit('updateRoles', roles);
        }
    }
}

// Check is a role is assigned
export const hasRole = function(roles, role) {
    if('symbol' !== typeof role) {
        console.log("Role is not a symbol: " + typeof role);
        return false;
    }

    const trace = process.env.TRACE_ROLES;

    if(!isValid(roles)) {
        console.log("Cannot check for role, roles not loaded!");
        return false;
    }

    if(!roles.has(role)) {
        if(trace)
            console.log("Check for role " + role.description + ", nope");
        return false;
    }

    const roleDetails = roles.get(role);
    if(trace)
        console.log("Check for role " + role.description + ", " + (roleDetails.assigned ? "assigned" : "nope, but owns objects"));

    return roleDetails.assigned;
}

// Returns all users that hold a specific role, null if no user with that role
// Assumes users have been loaded already and store in the root module of the store
export const findUsersWithRole = function(role, firstOnly = false) {
    const users = store.state.temp.usersByRole;
    if(isValid(users)) {
        const roleUserMap = users.has(role) ? users.get(role) : null;
        if(isValid(roleUserMap)) {
            const users = Array.from(roleUserMap.values());
            return firstOnly ? users.slice(0, 1) : users;
        }
    }

    return null;
}

// Find user with a specific email
// Returns User or null if no user with specified email
export const findUserWithEmail = function(processCode, email) {
    const users = store.state.temp.usersByProcess?.get(processCode);
    if(isValid(users) && isValid(email)) {
        for(const [checkinUserId, user] of users) {
            if(email === user.email)
                return user;
        }
    }

    return null;
}
