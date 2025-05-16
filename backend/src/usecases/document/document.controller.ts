import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentUseCase } from './document.usecase';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt-auth.guard';
// import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt'))
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentResponseDto,
} from './dto/crud-document.dto';

@ApiTags('Documents')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentController {
  constructor(private readonly useCase: DocumentUseCase) {}

  @Post('createdoc')
  @ApiResponse({ status: 201, type: DocumentResponseDto })
  create(@Body() dto: CreateDocumentDto) {
    return this.useCase.create(dto);
  }

  @Get('getAllDoc')
  @ApiResponse({ status: 200, type: [DocumentResponseDto] })
  findAll() {
    return this.useCase.findAll();
  }

  @Get('getDocby/:id')
  @ApiResponse({ status: 200, type: DocumentResponseDto })
  findOne(@Param('id') id: number) {
    return this.useCase.findOne(+id);
  }

  @Post('updateDocby/:id')
  update(@Param('id') id: number, @Body() dto: UpdateDocumentDto) {
    return this.useCase.update(+id, dto);
  }

  @Delete('deleteDocby/:id')
  remove(@Param('id') id: number) {
    return this.useCase.remove(+id);
  }
}
