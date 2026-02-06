// components/resume/Template2PDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';

// --- Define Styles ---
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 40, // Adjust page margins
        paddingVertical: 30,
        // fontFamily: 'YourFontName-Regular', // Apply registered font
        fontSize: 10, // Default font size
        lineHeight: 1.3,
    },
    displayName: {
        fontSize: 24,
        // fontWeight: 'bold', // Use if bold font registered
        marginBottom: 15, // Reduced from 20
    },
    contactInfo: {
        fontSize: 9,
    },
    contactLine: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 2,
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
    header: {
        textAlign: 'center',
        marginBottom: 15, // Reduced from 20
    },
    leftColumn: {
        flex: 1,
        paddingRight: 10,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    rightColumn: {
        flex: 2,
        paddingLeft: 10,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    contactItem: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    section: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
        color: '#333',
    },
    text: {
        fontSize: 11,
        color: '#333',
        marginBottom: 4,
    },
    twoColumnSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    threeColumnSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 10,
        color: '#777',
    },
});

// --- Template2 PDF Component ---
export const Template2PDF = ({ data }) => (
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
            
            {/* --- Summary Section --- */}
            {data?.bio && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <Text style={styles.text}>{data.bio}</Text>
                </View>
            )}
            
            {/* --- Experience Section --- */}
            {data?.experience?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    {data.experience.map((exp, index) => (
                        <View key={index} style={{ marginBottom: 8 }}>
                            <View style={styles.threeColumnSection}>
                                <Text style={styles.text}>
                                    {exp.title} at {exp.company}
                                </Text>
                                {exp.location && (
                                    <Text style={styles.text}>Location: {exp.location}</Text>
                                )}
                                <Text style={styles.dateText}>
                                    {new Date(exp.startDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric',
                                    })} -{' '}
                                    {new Date(exp.endDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </View>
                           
                            {exp.description && (
                                <Text style={styles.text}>{exp.description}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}
            
            {/* --- Education --- */}
            {data?.education?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {data.education.map((edu, index) => (
                        <View key={index} style={styles.entry}>
                            <View style={styles.twoColumnSection}>
                                <Text style={styles.title}>{edu.institution}, {edu.degree} in {edu.major}</Text>
                                <Text style={styles.dateText}>
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
            
            {/* --- Projects Section --- */}
            {data?.projects?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>
                    {data.projects.map((project, index) => (
                        <View key={index} style={{ marginBottom: 8 }}>
                            <View style={styles.twoColumnSection}>
                            <Text style={styles.text}>{project.name}</Text>
                            {project.githubUrl && (
                                <Link style={styles.text} src={project.githubUrl}>
                                    GitHub
                                </Link>
                            )}
                            {project.date && (
                                <Text style={styles.dateText}>
                                    {new Date(project.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </Text>
                            )}
                            </View>
                            {project.description && (
                                <Text style={styles.text}>{project.description}</Text>
                            )}
                            {project.technologies && (
                                <Text style={styles.text}>
                                    Technologies: {project.technologies.join(', ')}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}
            
            {/* --- Skills Section --- */}
            {data?.skills?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technical Skills</Text>
                    {data.skills.map((tech, index) => (
                        <Text key={index} style={styles.text}>
                            {tech.category}: {tech.items.join(', ')}
                        </Text>
                    ))}
                </View>
            )}
        
        </Page>
    </Document>
);
