import { isValid, makeEnum } from "@/utils";
import { store } from "@/store";

// Define all the roles in the IMS
export const Roles = {

    VO: makeEnum(['member']),
    IMS: makeEnum(['process-staff','ims-owner','ims-manager','ims-developer', 'strategy-coordinator', 'operations-coordinator']),
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
export const getRoleByName = function(processCode, role) {
    const roleCode = ('symbol' == typeof role) ? role.description : role;

    // Try implemented roles first
    const roleEnum = Roles[processCode];
    for(let name in roleEnum) {
        const role = roleEnum[name];
        const regexRole = "(" + name.replace("-", "\\-") + ")(?:\\-([^\\#]+))?";
        let regex = new RegExp(regexRole, "ig");
        let matches = regex.exec(roleCode);
        if(isValid(matches)) {
            let roleInfo = {
                role: role,
                roleCode: roleCode,
                roleKey: `${processCode}.${roleCode}`,
                processCode: processCode
            };

            const objectId = matches[2];
            if(isValid(objectId))
                roleInfo.objectId = objectId;
            else
                roleInfo.assigned = true;

            return roleInfo;
        }
    }

    // If we get here, this role is not yet implemented (field role will be missing)
    // Note: No object ownership for such roles
    return { roleCode: roleCode, roleKey: `${processCode}.${roleCode}`, processCode: processCode, assigned: true };
}

// Parse user roles from the entitlements the user has
// Note: Ignores roles that are not yet implemented
export const rolesFromEntitlements = function(entitlements, traceRoles) {
    console.log("Parsing roles...");

    let roles = new Map();
    const vo = process.env.VUE_APP_EGI_VO;
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
        roles.set(groupRoles.PROCESS_STAFF, { name: "process-staff", assigned: true });

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

    if(!isValid(traceRoles))
        traceRoles = Boolean(process.env.VUE_APP_IMS_TRACE_ROLES);

    if(traceRoles) {
        const assigned = [...roles].filter(([k, v]) => v.assigned && "member" !== k.description);
        console.log("Got " + assigned.length + " roles" + (roles.size > 0 ? ":" : ""));
        for(const roleDetails of roles.values()) {
            if(roleDetails.assigned)
                console.log("\t" + roleDetails.name);
            if(isValid(roleDetails.ownedEntities) && roleDetails.ownedEntities.size > 0) {
                for(const objectId of roleDetails.ownedEntities)
                    console.log("\t\t" + roleDetails.name + "-" + objectId);
            }
        }
    }

    return roles;
}

// Extract roles of current user
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

// Check if a role is assigned
export const hasRole = function(roles, role) {
    if('symbol' !== typeof role) {
        console.log("hasRole: role is not a string but a " + typeof role);
        return false;
    }

    if(!isValid(roles)) {
        console.log("Cannot check for role, roles not loaded!");
        return false;
    }

    const traceRoles = Boolean(process.env.VUE_APP_IMS_TRACE_ROLES);
    if(!roles.has(role)) {
        if(traceRoles)
            console.log(`Check for role ${role.description}, nope`);
        return false;
    }

    const roleDetails = roles.get(role);
    if(traceRoles)
        console.log(`Check for role ${role.description}, ${roleDetails.assigned ? "assigned" : "nope, but owns objects"}`);

    return isValid(roleDetails.assigned) && roleDetails.assigned;
}

// Returns array of users that hold a specific role, null if role is not assigned to anyone
// Assumes users have been loaded and stored in the root module of the store
export const findUsersWithRole = function(processCode, role, firstOnly = false) {
    const roleCode = ('symbol' == typeof role) ? role.description : role;
    const roleKey = `${processCode}.${roleCode}`;
    const users = store.state.temp?.usersByRole;
    if(isValid(users)) {
        const roleUserMap = users.get(roleKey);
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
        for(const user of users.values()) {
            if(email === user.email)
                return user;
        }
    }

    return null;
}

