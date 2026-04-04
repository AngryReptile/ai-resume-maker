import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData, useResumeStore } from '@/store/useResumeStore';

export const exportToDocx = async (data: ResumeData, title: string) => {
    const { sectionOrder, visibleSections, sectionLabels, customSections } = useResumeStore.getState();

    const sections: any[] = [
        // Header
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: data.personalInfo.fullName,
                    bold: true,
                    size: 32,
                }),
            ],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}`,
                    size: 20,
                }),
            ],
        }),
        new Paragraph({ text: '', spacing: { before: 200 } }),
    ];

    // Map through sectionOrder to respect user's structural choices
    sectionOrder.forEach((sectionId) => {
        if (!visibleSections.includes(sectionId)) return;

        // Handle Custom Sections
        if (sectionId.startsWith('custom-')) {
            const section = customSections.find(s => s.id === sectionId);
            if (section && section.content) {
                sections.push(
                    new Paragraph({
                        text: (sectionLabels[sectionId] || section.title).toUpperCase(),
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 300 },
                        border: { bottom: { color: 'auto', space: 1, style: 'single', size: 6 } },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: section.content, size: 22 })],
                        spacing: { before: 120, after: 200 },
                    })
                );
            }
            return;
        }

        const label = (sectionLabels[sectionId] || sectionId).toUpperCase();

        switch (sectionId) {
            case 'summary':
                if (data.personalInfo.summary) {
                    sections.push(
                        new Paragraph({
                            text: label,
                            heading: HeadingLevel.HEADING_1,
                            border: { bottom: { color: 'auto', space: 1, style: 'single', size: 6 } },
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: data.personalInfo.summary, size: 22 })],
                            spacing: { before: 120, after: 200 },
                        })
                    );
                }
                break;

            case 'experience':
                if (data.experience.length > 0) {
                    sections.push(
                        new Paragraph({
                            text: label,
                            heading: HeadingLevel.HEADING_1,
                            border: { bottom: { color: 'auto', space: 1, style: 'single', size: 6 } },
                        })
                    );
                    data.experience.forEach((exp) => {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({ text: exp.position, bold: true, size: 24 }),
                                    new TextRun({ text: ` at ${exp.company}`, size: 24 }),
                                ],
                                spacing: { before: 200 },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, italics: true, size: 20 }),
                                ],
                                spacing: { after: 100 },
                            })
                        );
                        exp.description.split('\n').forEach(bullet => {
                            if (bullet.trim()) {
                                sections.push(
                                    new Paragraph({
                                        text: bullet.replace(/^[•\s*-]+/, '').trim(),
                                        bullet: { level: 0 },
                                        spacing: { before: 50 }
                                    })
                                );
                            }
                        });
                    });
                }
                break;

            case 'education':
                if (data.education.length > 0) {
                    sections.push(
                        new Paragraph({
                            text: label,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 300 },
                            border: { bottom: { color: 'auto', space: 1, style: 'single', size: 6 } },
                        })
                    );
                    data.education.forEach((edu) => {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({ text: edu.school, bold: true, size: 24 }),
                                ],
                                spacing: { before: 200 },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: `${edu.degree} | ${edu.startDate} - ${edu.endDate}`, size: 22 }),
                                ],
                            })
                        );
                    });
                }
                break;

            case 'skills':
                if (data.skills.length > 0) {
                    sections.push(
                        new Paragraph({
                            text: label,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 300 },
                            border: { bottom: { color: 'auto', space: 1, style: 'single', size: 6 } },
                        }),
                        new Paragraph({
                            children: [new TextRun({ 
                                text: data.skills.map(s => s.name).join(', '), 
                                size: 22 
                            })],
                            spacing: { before: 120 },
                        })
                    );
                }
                break;

            case 'projects':
                if (data.projects.length > 0) {
                    sections.push(
                        new Paragraph({
                            text: label,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 300 },
                            border: { bottom: { color: 'auto', space: 1, style: 'single', size: 6 } },
                        })
                    );
                    data.projects.forEach((proj) => {
                        sections.push(
                            new Paragraph({
                                children: [new TextRun({ text: proj.title, bold: true, size: 24 })],
                                spacing: { before: 200 },
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: proj.content, size: 22 })],
                                spacing: { before: 100, after: 100 },
                            })
                        );
                    });
                }
                break;

            case 'languages':
                if (data.languages) {
                    sections.push(
                        new Paragraph({
                            text: label,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 300 },
                            border: { bottom: { color: 'auto', space: 1, style: 'single', size: 6 } },
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: data.languages, size: 22 })],
                            spacing: { before: 120 },
                        })
                    );
                }
                break;

            case 'interests':
                if (data.interests) {
                    sections.push(
                        new Paragraph({
                            text: label,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 300 },
                            border: { bottom: { color: 'auto', space: 1, style: 'single', size: 6 } },
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: data.interests, size: 22 })],
                            spacing: { before: 120 },
                        })
                    );
                }
                break;
        }
    });

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: sections,
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title || 'Resume'}.docx`);
};
