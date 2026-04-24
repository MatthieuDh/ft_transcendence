import { Injectable } from '@nestjs/common';
import { stringify } from 'csv-stringify/sync';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class ExportService {

    exportCsv(data: any): Buffer{
        const porjectRows = data.projectHealthList.map((p: any) => ({
            'Project Name': p.name,
            'Status': p.status,
            'Risk': p.risk,
            'Overdue Tasks': p.overdue,
            'Pending Too Long': p.pendingLong,
        }));

        const csv = stringify(porjectRows, { header: true });
        return Buffer.from(csv);
    }

    exportPdf(data: any): Promise<Buffer>{
        const fonts = {
            Helvetica : {
                normal: 'Helvetica',
                bold: 'Helvitca-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique'
            },
        };

        const printer = new (PdfPrinter as any)(fonts);
        const docDefinition: TDocumentDefinitions = {
            defaultStyle: {font: 'Helvetica'},
            content: [
                { text: 'Dashboard Report', style: 'header' },
                { text: '\Overall Metrics', style: 'subheader' },
                {
                    ul:[
                        'Total Projects: ${data.totalProjects}',
                        'Completed Projects: ${data.completedProjects}',
                        'Total Tasks: ${data.totalTasks}',
                        'Overdue Tasks: ${data.overdueTasks}',
                        'Pending over Limit: ${data.pendingOverLimit}',
                    ],
                },
                { text: 'Average Time Per Stage (days)', style: 'subheader'},
                {
                    ul: Object.entries(data.avgTimePerStage).map(([stage, days]) => '${stage}: ${says}d'),
                },
                {text: '\Project Health', style: 'subheader'},
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            ['Project', 'Status', 'Risk', 'Overdue', 'Pending Too Long'],
                            ...data.projectHealthList.map((p: any) => [
                                p.name, p.status, p.risk, p.overdue, p.pendingLong,
                            ]),
                        ],
                    },
                },
            ],
            styles:{
                header: { fontSize: 18, bold: true},
                subheader: { fontSize: 14, bold: true},
            },
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        return new Promise((resolve, reject) =>{
            const chunks: Buffer[] = [];
            pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
        });
    }

}
