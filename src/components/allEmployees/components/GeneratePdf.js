import jsPDF from 'jspdf';
import moment from 'moment';

// Helper functions for formatting complex data
const formatChildrenDetails = (childrenDetails) => {
    if (!childrenDetails || !Array.isArray(childrenDetails)) return '-';
    return childrenDetails
        .map(
            (child, index) =>
                `Child ${index + 1}:\n` +
                `  • Name: ${child.kidName || '-'}\n` +
                `  • Gender: ${child.kidGender || '-'}\n` +
                `  • Date of Birth: ${
                    child.kidDob ? moment(child.kidDob).format('DD/MM/YYYY') : '-'
                }`
        )
        .join('\n\n');
};

const formatExperienceDetails = (experience) => {
    if (!experience || !Array.isArray(experience)) return '-';
    return experience
        .map(
            (exp, index) =>
                `Experience ${index + 1}:\n` +
                `  • Company: ${exp.previousCompany || '-'}\n` +
                `  • Designation: ${exp.experienceDesignation || '-'}\n` +
                `  • Reporting Manager: ${exp.reportingManager || '-'}\n` +
                `  • Duration: ${
                    exp.startDate ? moment(exp.startDate).format('DD/MM/YYYY') : '-'
                } to ${exp.endDate ? moment(exp.endDate).format('DD/MM/YYYY') : '-'}\n` +
                `  • UAN Number: ${exp.uanNumber || '-'}`
        )
        .join('\n\n');
};

const formatEducationalDetails = (education) => {
    if (!education || !Array.isArray(education)) return '-';
    return education
        .map(
            (edu, index) =>
                `Education ${index + 1}:\n` +
                `  • Level: ${edu.education || '-'}\n` +
                `  • Specification: ${edu.specification || '-'}\n` +
                `  • Institution: ${edu.institution || '-'}\n` +
                `  • Duration: ${edu.startyear ? moment(edu.startyear).format('YYYY') : '-'} - ${
                    edu.endyear ? moment(edu.endyear).format('YYYY') : '-'
                }\n` +
                `  • GPA/Percentage: ${edu.gpa || '-'}`
        )
        .join('\n\n');
};

const generatePDF = (employeeObj, shouldSave) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    console.log('Educational Data:', employeeObj.educationList);
    console.log('employeeObject', employeeObj);

    const margin = 15;
    let y = 20;
    const cellHeight = 10;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    // Date formatting
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const mainHeading = 'Employee Registration Details';
    const mainHeadingWidth = doc.getTextWidth(mainHeading);
    const dateWidth = doc.getTextWidth(currentDate);

    const xCenteredMainHeading = (pageWidth - mainHeadingWidth) / 1.2;
    const xRightAlignedDate = pageWidth - margin - dateWidth;

    doc.text(mainHeading, xCenteredMainHeading, y, { align: 'center' });
    y += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${currentDate}`, xRightAlignedDate - 10, y);
    y += 15;

    // Data fields with formatted complex data
    const fields = [
        { header: 'First Name', value: employeeObj.firstname },
        { header: 'Last Name', value: employeeObj.lastname },
        { header: 'Full Name', value: employeeObj.fullname },
        { header: 'Email', value: employeeObj.email },
        { header: 'Work Email', value: employeeObj.workEmail },
        { header: 'Phone', value: employeeObj.phone },
        { header: 'Contact Number', value: employeeObj.contactNumber },
        { header: 'Gender', value: employeeObj.gender },
        {
            header: 'Date of Birth',
            value: employeeObj.employeeDateOfBirth
                ? moment(employeeObj.employeeDateOfBirth).format('DD/MM/YYYY')
                : '-'
        },
        { header: 'Blood Group', value: employeeObj.bloodGroup },
        { header: 'Marital Status', value: employeeObj.maritalStatus },
        { header: "Father's Name", value: employeeObj.fathername },
        { header: "Mother's Name", value: employeeObj.mothername },
        { header: 'Reference', value: employeeObj.reference },
        { header: 'Company', value: employeeObj.company },
        { header: 'Work Location', value: employeeObj.workLocationName },
        { header: 'Department', value: employeeObj.department },
        { header: 'Designation', value: employeeObj.designation },
        { header: 'Role', value: employeeObj.role },
        { header: 'Manager', value: employeeObj.manager },
        { header: 'Projects', value: employeeObj.projects },
        {
            header: 'Joining Date',
            value: employeeObj.joiningdate
                ? moment(employeeObj.joiningdate).format('DD/MM/YYYY')
                : '-'
        },
        { header: 'Employee ID', value: employeeObj.employeeid },
        { header: 'Employee Type', value: employeeObj.employeeType },
        { header: 'Employee Status', value: employeeObj.employeeStatus },
        {
            header: 'Date of Exit',
            value: employeeObj.dateOfExit
                ? moment(employeeObj.dateOfExit).format('DD/MM/YYYY')
                : '-'
        },
        { header: 'Address', value: employeeObj.address },
        { header: 'Country', value: employeeObj.country },
        { header: 'State', value: employeeObj.state },
        { header: 'City', value: employeeObj.city },
        { header: 'Zipcode', value: employeeObj.zipcode },
        { header: 'Permanent Address', value: employeeObj.permanentAddress || '-' },
        { header: 'Emergency Contact Number', value: employeeObj.emergencyContactNumber },
        { header: 'PAN Number', value: employeeObj.panNumber },
        { header: 'Aadhar Number', value: employeeObj.aadharNumber },
        { header: 'Name As Per Aadhar', value: employeeObj.nameAsPerAadhar },

        // Married-specific fields
        ...(employeeObj.maritalStatus === 'Married'
            ? [
                  { header: 'Spouse Name', value: employeeObj.spouseName },
                  { header: 'Spouse Aadhar Number', value: employeeObj.spouseAadharNumber },
                  { header: 'Number of Kids', value: employeeObj.numberOfKids || '0' },
                  {
                      header: 'Children Details',
                      value: formatChildrenDetails(employeeObj.childrenDetails)
                  }
              ]
            : []),

        { header: 'Bank Account Number', value: employeeObj.accountNumber },
        { header: 'IFSC Code', value: employeeObj.ifscCode },
        { header: 'Bank Name', value: employeeObj.bankName },
        { header: 'Manager Email', value: employeeObj.managerEmail },
        { header: 'Username', value: employeeObj.username },
        { header: 'Disabled', value: String(employeeObj.disabled) },

        // Experience fields
        ...(employeeObj.hasExperience
            ? [
                  {
                      header: 'Employee Experience',
                      value: formatExperienceDetails(employeeObj.employeeExperience)
                  }
              ]
            : [{ header: 'Is Fresher', value: employeeObj.isFresher ? 'Yes' : 'No' }]),

        {
            header: 'Educational Details',
            value: formatEducationalDetails(employeeObj.educationList)
        }
    ];

    // Calculate maximum header width
    const maxHeaderWidth = Math.max(...fields.map((field) => doc.getTextWidth(`${field.header}:`)));

    // Iterate through fields
    doc.setFontSize(12);
    fields.forEach((row) => {
        const { header, value } = row;
        const xField = margin + 25;
        const xColon = xField + maxHeaderWidth + 15;
        const xValue = xColon + 15;

        // Set bold for header
        doc.setFont('helvetica', 'bold');
        doc.text(header, xField, y);

        // Calculate wrapped text height
        const valueLines = doc.splitTextToSize(String(value), pageWidth - xValue - margin - 5);
        const lineHeight = 6;
        const textHeight = valueLines.length * lineHeight;

        // Check if content fits on the page
        if (y + textHeight > pageHeight - margin) {
            doc.addPage(); // Add a new page
            y = margin + cellHeight; // Reset y position to the top margin
        }

        // Add colon and content
        doc.setFont('helvetica', 'normal');
        doc.text(':', xColon, y);

        // Print value with line breaks
        valueLines.forEach((line, index) => {
            doc.text(line, xValue, y + lineHeight * index);
        });

        y += Math.max(cellHeight, textHeight);

        // Ensure next field starts on a new page if required
        if (y + cellHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    });

    // Add signature
    const signatureY = pageHeight - margin - 20;
    const signatureX = pageWidth - margin - 60;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Employee Signature:', signatureX, signatureY);

    if (shouldSave) {
        doc.save('employee_registration.pdf');
    } else {
        return new Promise((resolve) => {
            const pdfBlob = doc.output('blob');
            resolve(pdfBlob);
        });
    }
};

export default generatePDF;
