import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { StatisticUseCase } from './statistic.usecase';
import {
  ActionByDateDto,
  GetStatisticDto,
  GetViewStatsDto,
} from './dto/get-statistic.dto';
import { Response } from 'express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticUseCase: StatisticUseCase) {}
  @Get()
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  async getStatistics(@Query() dto: GetStatisticDto) {
    const data = await this.statisticUseCase.getStatisticData(dto);
    return {
      success: true,
      data,
    };
  }
  @Get('export')
  async exportStatisticExcel(
    @Query() dto: GetStatisticDto,
    @Res() res: Response,
  ) {
    const buffer = await this.statisticUseCase.exportStatisticExcel(dto);
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=statistics.xlsx',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
  @Get('/view-by-date')
  async getViewStats(@Query() dto: GetViewStatsDto) {
    // Nếu không truyền fromDate/toDate thì tự tính 7 ngày gần nhất
    if (!dto.fromDate || !dto.toDate) {
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(toDate.getDate() - 6); // 7 ngày tính cả hôm nay

      dto.fromDate = fromDate.toISOString().split('T')[0]; // YYYY-MM-DD
      dto.toDate = toDate.toISOString().split('T')[0];
    }

    return this.statisticUseCase.getViewStatsByDate(dto);
  }
  @Get('view-by-date/:userId')
  @ApiOperation({ summary: 'Get user action history grouped by date' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of user actions grouped by date',
    type: [ActionByDateDto],
  })
  async viewByDate(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ActionByDateDto[]> {
    return this.statisticUseCase.viewByDate(userId);
  }
}
