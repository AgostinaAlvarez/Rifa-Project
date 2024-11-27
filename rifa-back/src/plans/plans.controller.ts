import { Controller, Post, HttpStatus, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorador';
import { Roles } from '../utils/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../utils/dto/error.dto';
import { PlanService } from './plans.service';
import { CreatePlanRequestDto } from './dto/createPlans.dto';
import { CreateResponsePlanDto } from './dto/createPlansResponse.dto';
import { Plans } from './plans.model';
import { GetUser } from '../utils/decorators/user.decorator';
import { UserInterface } from '../utils/interface/user.interface';
import { CreateSuscriptionRequestDto } from './dto/createSuscription.dto';
import { CreateSuscriptionResponseDto } from './dto/createSuscriptionResponse.dto';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly planService: PlanService) {}

  @ApiOperation({
    summary: 'Create plan',
    description: 'Creates a plan',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreateResponsePlanDto),
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @Auth()
  @Roles(Role.ADMIN)
  @Post()
  async createPlan(
    @Body() plan: CreatePlanRequestDto,
  ): Promise<CreateResponsePlanDto> {
    return this.planService.create(plan);
  }

  @ApiOperation({
    summary: 'Get plans',
    description: 'Returns an Array of plans',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper([CreateResponsePlanDto]),
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @Auth()
  @Roles(Role.ADMIN, Role.BASIC_USER)
  @Get()
  async getAllPlans(): Promise<Plans[]> {
    return this.planService.findAllPlans();
  }

  @ApiOperation({
    summary: 'Create suscription',
    description: 'Creates a susciption',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreateSuscriptionResponseDto),
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Payment creation failed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Internal server error',
  })
  @Auth()
  @Roles(Role.BASIC_USER)
  @Post(':id/create-suscription')
  async createSuscription(
    @Body() data: CreateSuscriptionRequestDto,
    @GetUser() user: UserInterface,
    @Param('id') planId: string,
  ): Promise<CreateSuscriptionResponseDto> {
    return this.planService.createSuscription(data, user, planId);
  }

  @ApiOperation({
    summary: 'Get plan',
    description: 'Returns a plan',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(CreateResponsePlanDto),
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Forbidden',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Plan not found',
  })
  @Auth()
  @Roles(Role.BASIC_USER)
  @Get(':id')
  async getPlan(@Param('id') id: string): Promise<Plans> {
    return this.planService.findPlan(id);
  }
}
