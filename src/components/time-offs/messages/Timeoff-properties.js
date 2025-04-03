export const LeaveMsgResProps = {
    head: {
        title: {
            leaveList: 'Leave - List',
            leaveAdd: 'Leave - Add',
            leaveView: 'Leave- View',
            leaveEdit: 'Leave - Edit'
        }
    },
    body: {
        content: {
            leaves: 'Leave',
            addLeave: 'Add Leave',
            viewLeave: 'View Leave Details',
            editLeave: 'Edit Leave',
            leaveDetails: 'Leave Details',
            noRolesFound: 'No Leave found',
            noRoleFound: 'Role information not found',
            accessPrivileges: 'Access Privileges'
        },
        form: {
            leave_type: {
                label: 'LeaveType'
            },
            from_date: {
                label: 'From Date'
            },
            to_date: {
                label: 'To Date'
            },
            no_of_days: {
                label: 'No of Days'
            },
            name: {
                label: 'Emp Name'
            },
            status: {
                label: 'Status'
            },
            approval_id: {
               label: 'Approved By'
             }, 
            description: {
                label: 'Description'
            },
            rejectreason: {
                label: 'Reason'
            },
            actions: {
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
