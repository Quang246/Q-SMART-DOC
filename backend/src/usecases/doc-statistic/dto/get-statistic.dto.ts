import { IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetStatisticDto {
  @ApiPropertyOptional({
    type: String,
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    type: String,
    example: '2024-01-31',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
export class GetViewStatsDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
export class ViewStatisticByDateDto {
  @ApiProperty()
  userId: number;
}

export class ActionByDateDto {
  @ApiProperty()
  date: string;

  @ApiProperty({ type: () => [ActionDetailDto] })
  actions: ActionDetailDto[];
}

export class ActionDetailDto {
  @ApiProperty()
  documentId: number;

  @ApiProperty()
  documentTitle: string;
  @ApiProperty()
  actionType: string;

  @ApiProperty()
  actionTime: string;

  @ApiProperty()
  ipAddress: string;
}
