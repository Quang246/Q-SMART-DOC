import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentStatistic } from 'src/infrastructure/repositories/document-statistic.entity';
import {
  GetStatisticDto,
  GetViewStatsDto,
  ActionByDateDto,
  ActionDetailDto,
} from './dto/get-statistic.dto';
import * as ExcelJS from 'exceljs';
import { Buffer } from 'buffer';
export interface StatisticExportRow {
  document_id: number;
  title: string;
  total_views: number;
  total_downloads: number;
}
export interface StatisticExportSummary {
  total_views: number;
  total_downloads: number;
  total_interactions: number;
}
export class ViewStatDto {
  view_date: string;
  view_count: number;
}
export interface StatisticExportResult {
  items: StatisticExportRow[];
  summary: StatisticExportSummary;
}
function generateDateRange(fromDate: string, toDate: string): string[] {
  const result: string[] = [];
  const start = new Date(fromDate);
  const end = new Date(toDate);

  while (start <= end) {
    result.push(new Date(start).toISOString().split('T')[0]);
    start.setDate(start.getDate() + 1);
  }

  return result;
}
@Injectable()
export class StatisticUseCase {
  constructor(
    @InjectRepository(DocumentStatistic)
    private readonly statRepo: Repository<DocumentStatistic>,
  ) {}

  async getStatisticData(dto: GetStatisticDto): Promise<StatisticExportResult> {
    const query = this.statRepo
      .createQueryBuilder('stat')
      .select('stat.document_id', 'document_id')
      .addSelect('d.title', 'title')
      .addSelect(
        `SUM(CASE WHEN stat.action_type = 'view' THEN 1 ELSE 0 END)`,
        'total_views',
      )
      .addSelect(
        `SUM(CASE WHEN stat.action_type = 'download' THEN 1 ELSE 0 END)`,
        'total_downloads',
      )
      .addSelect(
        "SUM(CASE WHEN action_type = 'view' THEN 1 ELSE 0 END) + SUM(CASE WHEN action_type = 'download' THEN 1 ELSE 0 END)",
        'total_interactions',
      )
      .groupBy('stat.document_id')
      .innerJoin('document', 'd', 'stat.document_id = d.document_id')
      .addGroupBy('d.title')
      .orderBy('total_interactions', 'DESC');
    if (dto.fromDate) {
      query.andWhere('stat.action_time >= :fromDate', {
        fromDate: dto.fromDate,
      });
    }

    if (dto.toDate) {
      query.andWhere('stat.action_time <= :toDate', { toDate: dto.toDate });
    }

    const data = await query.getRawMany<StatisticExportRow>();

    const totalQuery = this.statRepo
      .createQueryBuilder('stat')
      .select([
        "SUM(CASE WHEN stat.action_type = 'view' THEN 1 ELSE 0 END) AS total_views",
        "SUM(CASE WHEN stat.action_type = 'download' THEN 1 ELSE 0 END) AS total_downloads",
        "SUM(CASE WHEN stat.action_type = 'view' THEN 1 ELSE 0 END) + SUM(CASE WHEN stat.action_type = 'download' THEN 1 ELSE 0 END) AS total_interactions",
      ]);
    const summary = (await totalQuery.getRawOne<StatisticExportSummary>()) ?? {
      total_views: 0,
      total_downloads: 0,
      total_interactions: 0,
    };
    return { items: data, summary };
  }

  async exportStatisticExcel(dto: GetStatisticDto): Promise<Buffer> {
    const { items } = await this.getStatisticData(dto);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Document Statistics');

    worksheet.columns = [
      { header: 'Document ID', key: 'document_id', width: 15 },
      { header: 'Title', key: 'title', width: 80 },
      { header: 'Total Views', key: 'total_views', width: 15 },
      { header: 'Total Downloads', key: 'total_downloads', width: 20 },
    ];

    worksheet.addRows(items);

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
  async getViewStatsByDate(dto: GetViewStatsDto): Promise<ViewStatDto[]> {
    const query = this.statRepo
      .createQueryBuilder('stat')
      .select("DATE_FORMAT(stat.action_time, '%Y-%m-%d')", 'view_date')
      .addSelect('COUNT(*)', 'view_count')
      .where('stat.action_type = :type', { type: 'view' })
      .groupBy("DATE_FORMAT(stat.action_time, '%Y-%m-%d')")
      .orderBy('view_date', 'ASC');

    if (dto.fromDate) {
      query.andWhere('DATE(stat.action_time) >= :fromDate', {
        fromDate: dto.fromDate,
      });
    }

    if (dto.toDate) {
      query.andWhere('DATE(stat.action_time) <= :toDate', {
        toDate: dto.toDate,
      });
    }

    const rawData = await query.getRawMany<{
      view_date: string;
      view_count: string;
    }>();

    const dataMap = new Map<string, number>();
    rawData.forEach((row) => {
      dataMap.set(row.view_date, parseInt(row.view_count, 10));
    });

    const from =
      dto.fromDate ||
      new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
    const to = dto.toDate || new Date().toISOString().split('T')[0];

    const fullDates = generateDateRange(from, to);

    return fullDates.map((date) => ({
      view_date: date,
      view_count: dataMap.get(date) || 0,
    }));
  }
  async viewByDate(userId: number): Promise<ActionByDateDto[]> {
    const stats = await this.statRepo.find({
      where: { user_id: userId },
      relations: ['document'],
      order: { action_time: 'DESC' },
    });

    const grouped: Record<string, ActionDetailDto[]> = stats.reduce(
      (acc, curr) => {
        const date = curr.action_time.toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push({
          documentId: curr.document_id,
          documentTitle: curr.document?.title,
          actionType: curr.action_type,
          actionTime: curr.action_time.toISOString(),
          ipAddress: curr.ip_address,
        });
        return acc;
      },
      {} as Record<string, ActionDetailDto[]>,
    );

    return Object.entries(grouped).map(([date, actions]) => ({
      date,
      actions,
    }));
  }
}
