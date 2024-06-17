import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';

describe('SeedService', () => {
  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedService],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('Debería responder con un mensaje de éxito al ejecutar las semillas', () => {
    expect(service.runSeeds()).toEqual({ message: 'Seeds executed successfully!' });
  });
});
