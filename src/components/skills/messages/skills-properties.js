export const SkillMsgResProps = {
    head: {
        title: {
            skillList: ' Skill- List',
            skillAdd: 'Skill - Add',
            skillView: 'Skill - View',
            skillEdit: 'Skill - Edit'
        }
    },
    body: {
        content: {
            skills: 'Skill',
            addSkill: 'Add Skill',
            viewSkill: 'View Skill Details',
            editSkill: 'Edit Skill',
            skillDetails: 'Skill Details',
            noRolesFound: 'No Skill found',
            noRoleFound: 'Role information not found',
            accessPrivileges: 'Access Privileges'
        },
        form: {
            skillid: {
               label:'#'
            },
            fullname: {
                label: 'Employee Name'
            },
            skill: {
                label: 'Skills'
            },
            level_type:{
                label: 'Expertise'
            },
            approval_id: {
                label: 'Approved By'
            },
            status: {
                label: 'Approved Status '
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
