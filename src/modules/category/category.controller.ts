import { Controller, Get, Post, Body } from '@nestjs/common';
import { RequestUser } from 'src/decorators/requestUser.decorator';
import { RequestUserType } from 'src/decorators/requestUser.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Public } from 'src/decorators/publicRoutes.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @RequestUser() req: RequestUserType,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto, req.user.isAdmin);
  }

  @Public()
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
}
