// components/resume/ResumePDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link } from '@react-pdf/renderer';

// --- Font Registration (Optional but Recommended) ---
// If you want to use specific fonts like in your target PDF, you need to register them.
// Download the font files (e.g., .ttf) and place them in your project (e.g., public/fonts).
// Font.register({
//   family: 'YourFontName-Regular', // e.g., 'Lato-Regular'
//   src: '/fonts/YourFontName-Regular.ttf',
// });
// Font.register({
//   family: 'YourFontName-Bold', // e.g., 'Lato-Bold'
//   src: '/fonts/YourFontName-Bold.ttf',
//   fontWeight: 'bold',
// });
// Font.register({
//    family: 'YourFontName-Italic', // e.g., 'Lato-Italic'
//    src: '/fonts/YourFontName-Italic.ttf',
//    fontStyle: 'italic',
//  });


// --- Define Styles ---
// These styles are basic approximations based on the uploaded PDF.
// You WILL need to adjust font families, sizes, margins, padding, etc. extensively.
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 40, // Adjust page margins
        paddingVertical: 30,
        // fontFamily: 'YourFontName-Regular', // Apply registered font
        fontSize: 10, // Default font size
        lineHeight: 1.3,
    },
    header: {
        textAlign: 'center',
        marginBottom: 15, // Reduced from 20
    },
    displayName: {
        fontSize: 24,
        // fontWeight: 'bold', // Use if bold font registered
        marginBottom: 15, // Reduced from 20
    },
    bio: {
        fontSize: 10,
        marginBottom: 10, // Reduced from 15
    },
    contactInfo: {
        fontSize: 9,
        color: '#333333', // Adjust color
    },
    contactLine: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 2,
    },
    section: {
        marginBottom: 10, // Reduced from 12
    },
    sectionTitle: {
        fontSize: 14,
        // fontWeight: 'bold', // Use if bold font registered
        marginBottom: 6, // Reduced from 8
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 2,
        textTransform: 'uppercase', // Match the style in the PDF
    },
    entry: {
        marginBottom: 10,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 3, // Removed this line
    },
    title: {
        fontSize: 11,
        // fontWeight: 'bold', // Use if bold font registered
    },
    subtitle: {
        fontSize: 10,
        fontStyle: 'italic', // e.g., for location or degree
    },
    date: {
        fontSize: 9,
        color: '#555555',
    },
    gpa: {
        fontSize: 9,
        marginBottom: 3,
    },
    descriptionItem: {
        flexDirection: 'row',
        marginLeft: 10, // Indent bullet points
        marginBottom: 3,
    },
    bulletPoint: {
        width: 10,
        fontSize: 10,
    },
    descriptionText: {
        flex: 1,
        fontSize: 10,
    },
    publicationEntry: {
        marginBottom: 10,
    },
    publicationTitle: {
        // fontWeight: 'bold',
        fontSize: 11,
    },
    publicationAuthors: {
        fontSize: 10,
        fontStyle: 'italic',
    },
    publicationLink: {
        fontSize: 9,
        color: 'blue', // Style links appropriately
    },
    projectEntry: {
        marginBottom: 10,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 3, // Removed this line
    },
    projectName: {
        // fontWeight: 'bold',
        fontSize: 11,
    },
    projectDate: {
        fontSize: 9,
        color: '#555555',
    },
    projectLink: {
        fontSize: 9,
        color: 'blue',
        marginBottom: 3,
    },
    toolsUsed: {
        fontSize: 9,
        marginTop: 0, // Reduced from 3
    },
    technologySection: {
        marginTop: 2, // Reduced from 10
    },
    technologyLine: {
        fontSize: 10,
        marginBottom: 3,
    }
});

// --- Resume PDF Component ---
export const ResumePDF = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            
            {/* --- Header --- */}
            <View style={styles.header}>
                <Text style={styles.displayName}>{data.displayName}</Text>
                <View style={styles.contactLine}>
                    <Text style={styles.contactInfo}>{data.location} | </Text>
                    <Link style={styles.contactInfo} src={`mailto:${data.email}`}>{data.email}</Link>
                    <Text style={styles.contactInfo}> | {data.phone}</Text>
                    {/*<Link style={styles.contactInfo} src={`http://${data.website}`}> | {data.website}</Link>*/}
                </View>
                <View style={styles.contactLine}>
                    {data?.socialLinks?.map((link, index) => {
                        const username = link.url.replace(/^https?:\/\/(www\.)?/, '');
                        
                        return (
                            <React.Fragment key={index}>
                                <Link style={styles.contactInfo} src={link.url}>{username}</Link>
                                {index < data.socialLinks.length - 1 && <Text style={styles.contactInfo}> | </Text>}
                            </React.Fragment>
                        );
                    })}
                </View>
            
            </View>
            
            
            {/* --- Summary --- */}
            {data?.bio && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <Text style={styles.bio}>{data.bio}</Text>
                </View>
            )}
            
            
            {/* --- Education --- */}
            {data?.education?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {data.education.map((edu, index) => (
                        <View key={index} style={styles.entry}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.title}>{edu.institution}, {edu.degree} in {edu.major}</Text>
                                <Text style={styles.date}>
                                   {new Date(edu.graduationDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                </Text>
                            </View>
                            {edu.description && (
                                <View style={styles.descriptionItem}>
                                    <Text style={styles.bulletPoint}>•</Text>
                                    <Text style={styles.descriptionText}>{edu.description}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}
            
            
            {/* --- Experience --- */}
            {data?.experience?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    {data.experience.map((exp, index) => (
                        <View key={index} style={styles.entry}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.title}>{exp.title}, {exp.company}, {exp.location}</Text>
                                <Text style={styles.date}>
                                    {new Date(exp.startDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })} -
                                    {new Date(exp.endDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                </Text>
                            </View>
                            {/* Handle single string description properly */}
                            {exp.description && (
                                <View style={styles.descriptionItem}>
                                    <Text style={styles.descriptionText}>{exp.description}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}
            
            
            {/* --- Publications --- */}
            {data?.publications?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Publications</Text>
                    {data.publications.map((pub, index) => (
                        <View key={index} style={styles.publicationEntry}>
                            <Text style={styles.publicationTitle}>{pub.title}</Text>
                            <Text style={styles.publicationAuthors}>{pub.authors}</Text>
                            {/* Assuming pub.link is a DOI or similar identifier, not a full URL */}
                            <Link style={styles.publicationLink} src={`https://doi.org/${pub.link}`}>{pub.link}</Link>
                        </View>
                    ))}
                </View>
            )}
            
            {/* --- Projects --- */}
            {data?.projects?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>
                    {data.projects.map((project, index) => (
                        <View key={index} style={styles.projectEntry}>
                            <View style={styles.projectHeader}>
                                <View style={[styles.projectHeader, { gap: 8 }]}>
                                    <Text style={styles.projectName}>{project.name}</Text>
                                    {project.github && <Link style={styles.projectLink} src={project.githubUrl}>GitHub</Link>}
                                </View>
                                {project.date && (
                                    <Text style={styles.projectDate}>
                                        {new Date(project.date).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                    </Text>
                                )}
                            </View>
                            {project.description && (
                                <View style={styles.descriptionItem}>
                                    <Text style={styles.descriptionText}>{project.description}</Text>
                                </View>
                            )}
                            {project.technologies && (
                                <Text style={styles.toolsUsed}>Technologies: {project.technologies.join(', ')}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}
            
            {/* --- Technologies --- */}
            {data?.skills?.length > 0 && (
                <View style={[styles.section, styles.technologySection]}>
                    <Text style={styles.sectionTitle}>Technical Skills</Text>
                    {data.skills.map((tech, index) => (
                        <Text key={index} style={styles.technologyLine}>
                            {tech.category}: {tech.items.join(', ')}
                        </Text>
                    ))}
                </View>
            )}
        
        
        </Page>
    </Document>
);