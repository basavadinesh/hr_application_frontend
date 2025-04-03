export const DesignationMsgResProps = {
    head: {
        title: {
            designationList: 'Designation - List',
            designationAdd: 'Designation - Add',
            designationView: 'Designation - View',
            designationEdit: 'Designation - Edit'
        }
    },
    body: {
        content: {
            designations: 'Designation',
            addDesignation: 'Add Designation',
            viewDesignation: 'View Designation Details',
            editDesignation: 'Edit Designation',
            designationDetails: 'Designation Details',
            noRolesFound: 'No Designations found',
            noRoleFound: 'Role information not found',
            accessPrivileges: 'Access Privileges'
        },
        form: {
            Designation: {
                label: 'Designation'
            },
            Department: {
                label: 'Department'
            },
            action: {
                label: 'Actions'
            }
        },
        notification: {
            confirmation: {
                addRoleTitle: 'Are you sure you to add the Role with following details:',
                addRoleNote: 'Role For data cannot be modified later.',
                editRoleTitle: 'Are you sure you to update the Role details ?'
            },
            success: {
                addRole: 'Role is added successfully.',
                editRole: 'Role is modified successfully.'
            },
            error: {
                message: 'An error has occured.',
                roleType: {
                    empty: 'Role Type is required.'
                },
                roleName: {
                    empty: 'Role Name is required.',
                    invalid: 'Role Name is not valid.',
                    duplicate: 'Role Name already exists.'
                }
            },
            warning: {
                roleNoEditLoginUser:
                    'This Role information can not be modified as your account is assigned with this Role.',
                roleMain: 'This Role information can not be modified.'
            }
       }
    }
};
