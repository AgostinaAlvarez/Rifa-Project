import { Body, Controller, HttpStatus, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../utils/dto/error.dto';
import { FilesService } from './files.service';
import { UploadUrlDto } from './dto/uploadUrl.dto';
import { UploadUrlResponseDto } from './dto/uploadUrlResponse.dto';

@ApiTags('FILES')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({
    summary: 'Upload image url',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(UploadUrlResponseDto),
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @Post('upload-url')
  @HttpCode(200)
  uploadUrl(@Body() data: UploadUrlDto): Promise<UploadUrlResponseDto> {
    return this.filesService.uploadUrl(data);
  }
}
