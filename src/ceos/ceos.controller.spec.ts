import { Test, TestingModule } from '@nestjs/testing';
import { CeosController } from './ceos.controller';
import { CeosService } from './ceos.service';

describe('CeosController', () => {
  let controller: CeosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CeosController],
      providers: [CeosService],
    }).compile();

    controller = module.get<CeosController>(CeosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
