import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { DocumentUseCase } from './document.usecase';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentResponseDto,
} from './dto/crud-document.dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly useCase: DocumentUseCase) {}

  @Post()
  @ApiResponse({ status: 201, type: DocumentResponseDto })
  create(@Body() dto: CreateDocumentDto) {
    return this.useCase.create(dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [DocumentResponseDto] })
  findAll() {
    return this.useCase.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: DocumentResponseDto })
  findOne(@Param('id') id: number) {
    return this.useCase.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDocumentDto) {
    return this.useCase.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.useCase.remove(+id);
  }
}
