import { Test, TestingModule } from '@nestjs/testing';
import { CeosService } from './ceos.service';

describe('CeosService', () => {
  let service: CeosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CeosService],
    }).compile();

    service = module.get<CeosService>(CeosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
