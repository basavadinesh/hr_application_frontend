export const AttendanceMsgResProps = {
    head: {
        title: {
            attendanceList: 'Attendance - List',
            attendanceAdd: 'Attendance - Add',
            attendanceView: 'Attendance - View',
            attendanceEdit: 'Attendance - Edit'
        }
    },
    body: {
        content: {
            attendance: 'Attendance',
            addAttendance: 'Add Attendance',
            viewAttendance: 'View Attendance Details',
            editAttendance: 'Edit Attendance',
            attendanceDetails: 'Attendance Details',
            noRolesFound: 'No Attendance found',
            noRoleFound: 'Role information not found',
            accessPrivileges: 'Access Privileges'
        },
        form: {
            id: {
                label: '#'
            },
            date: {
                label: 'Date'
            },
            startTime: {
                label: 'Punch In'
            },
            endTime: {
                label: 'Punch Out'
            },
            loginhours: {
                label: 'Production'
            },
            breakhours: {
                label: 'Break'
            },
            overtimehours: {
                label: 'Overtime'
            },
            // action: {
            //     label: 'Actions'
            // }
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
