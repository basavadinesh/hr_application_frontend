export const ProjectMsgResProps = {
    head: {
        title: {
            projectList: 'Project - List',
            projectAdd: 'Project - Add',
            projectView: 'Project - View',
            projectEdit: 'Project - Edit'
        }
    },
    body: {
        content: {
            projects: 'Project',
            addProject: 'Add Project',
            viewProject: 'View Project Details',
            editProject: 'Edit Project',
            projectDetails: 'Project Details',
            noRolesFound: 'No Projects found',
            noRoleFound: 'Role information not found',
            accessPrivileges: 'Access Privileges'
        },
        form: {
            project: {
                label: 'Project'
            },
            // projectId: {
            //     label: 'Project ID'
            // },
            projectlead: {
                label: 'Project Lead'
            },
            // team: {
            //     label: 'Team'
            // },
            deadline: {
                label: 'Dead Line'
            },
            startdate: {
                label: 'Start Date'
            },
            enddate: {
                label: 'End date'
            },
            priority: {
                label: 'Priority'
            },
            price: {
                label: 'Price'
            },
            currency: {
                label: 'Currency'
            },
            document: {
                label: 'Document'
            },
            billingtype: {
                label: 'Billing Type'
            },
            teamtype: {
                label: 'Project Type'
            },
            description: {
                label: 'Description'
            },
            status: {
                label: 'Status'
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