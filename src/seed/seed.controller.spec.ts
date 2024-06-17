import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

describe('SeedController', () => {
  let seedController: SeedController;
  let seedService: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [SeedService],
    }).compile();

    seedController = module.get<SeedController>(SeedController);
    seedService = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(seedController).toBeDefined();
  });

  describe('executeSeeds', () => {
    it('should return the result of seedService.runSeeds', async () => {
      const result = { message: 'Seeds executed successfully!' };
      jest.spyOn(seedService, 'runSeeds').mockImplementation(() => result);

      expect(await seedController.executeSeeds()).toBe(result);
    });
  });
});
